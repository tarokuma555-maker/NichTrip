"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
  refreshPro: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isPro: false,
  signOut: async () => {},
  refreshPro: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  const supabase = createSupabaseBrowser();

  const checkProStatus = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", userId)
          .in("status", ["active", "trialing"])
          .maybeSingle();
        setIsPro(!!data);
      } catch {
        setIsPro(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsPro(false);
  }, [supabase]);

  const refreshPro = useCallback(async () => {
    if (user) await checkProStatus(user.id);
  }, [user, checkProStatus]);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isPro, signOut, refreshPro }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
