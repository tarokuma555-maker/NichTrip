"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { User, Session } from "@supabase/supabase-js";

const CHECKOUT_PENDING_KEY = "animetrips_checkout_pending";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPro: boolean;
  proActivating: boolean;
  signOut: () => Promise<void>;
  refreshPro: () => Promise<void>;
  markCheckoutPending: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isPro: false,
  proActivating: false,
  signOut: async () => {},
  refreshPro: async () => {},
  markCheckoutPending: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [proActivating, setProActivating] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const supabase = createSupabaseBrowser();

  // 開発者用: URLパラメータ or localStorage で Pro 強制モード
  // スマホ: ?dev_pro=true で ON / ?dev_pro=false で OFF
  const checkDevOverride = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const devPro = params.get("dev_pro");
      if (devPro === "true") {
        localStorage.setItem("dev_force_pro", "true");
      } else if (devPro === "false") {
        localStorage.removeItem("dev_force_pro");
      }
      return localStorage.getItem("dev_force_pro") === "true";
    } catch {
      return false;
    }
  }, []);

  const checkProStatus = useCallback(
    async (userId: string) => {
      // 開発者オーバーライド
      if (checkDevOverride()) {
        setIsPro(true);
        return;
      }
      try {
        // まずDBを確認（高速）
        const { data } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", userId)
          .in("status", ["active", "trialing"])
          .maybeSingle();
        if (data) {
          setIsPro(true);
          return;
        }
        // DBに無ければStripeに直接確認（Webhook未到達のリカバリ）
        try {
          const res = await fetch("/api/stripe/verify", { method: "POST" });
          const result = await res.json();
          setIsPro(!!result.isPro);
        } catch {
          setIsPro(false);
        }
      } catch {
        setIsPro(false);
      }
    },
    [supabase, checkDevOverride]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (checkDevOverride()) {
        setIsPro(true);
      } else if (s?.user) {
        checkProStatus(s.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        checkProStatus(s.user.id);
      } else {
        setIsPro(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, checkProStatus]);

  // Stripe決済後のポーリング: /api/stripe/verify でStripe本体に確認 & DB同期
  const startPolling = useCallback(
    () => {
      if (pollingRef.current) return;
      setProActivating(true);
      let attempts = 0;
      const maxAttempts = 20; // 最大20回（約60秒）
      pollingRef.current = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch("/api/stripe/verify", { method: "POST" });
          const data = await res.json();
          if (data.isPro) {
            setIsPro(true);
            setProActivating(false);
            try { sessionStorage.removeItem(CHECKOUT_PENDING_KEY); } catch {}
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
          }
        } catch {}
        if (attempts >= maxAttempts) {
          setProActivating(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }, 3000);
    },
    []
  );

  // マウント時 & ユーザー変更時にcheckout pendingフラグを確認
  useEffect(() => {
    if (!user || isPro) return;
    try {
      if (sessionStorage.getItem(CHECKOUT_PENDING_KEY) === "true") {
        startPolling();
      }
    } catch {}
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user, isPro, startPolling]);

  const markCheckoutPending = useCallback(() => {
    try { sessionStorage.setItem(CHECKOUT_PENDING_KEY, "true"); } catch {}
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsPro(false);
    setProActivating(false);
    try { sessionStorage.removeItem(CHECKOUT_PENDING_KEY); } catch {}
  }, [supabase]);

  const refreshPro = useCallback(async () => {
    if (user) await checkProStatus(user.id);
  }, [user, checkProStatus]);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isPro, proActivating, signOut, refreshPro, markCheckoutPending }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
