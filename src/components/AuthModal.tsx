"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useTranslations } from "next-intl";

type Tab = "login" | "signup";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function AuthModal({
  onClose,
  defaultTab = "login",
}: {
  onClose: () => void;
  defaultTab?: Tab;
}) {
  const t = useTranslations("AuthModal");
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const supabase = createSupabaseBrowser();

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (tab === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (err) {
        setError(err.message);
      } else {
        setSuccess(t("signupSuccess"));
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(
          err.message === "Invalid login credentials"
            ? t("invalidCredentials")
            : err.message
        );
      } else {
        onClose();
      }
    }

    setLoading(false);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-end sm:items-center justify-center px-4 py-4 sm:py-8">
      <div className="w-full max-w-sm bg-[#111] border-2 border-white/20 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6">
        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white text-[#333] text-sm font-bold border-2 border-white/80 hover:bg-gray-100 transition-colors"
        >
          <GoogleIcon />
          {t("googleLogin")}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-[11px] text-white/30">{t("or")}</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* タブ */}
        <div className="flex border-b-2 border-white/10 mb-6">
          {(["login", "signup"] as Tab[]).map((tt) => (
            <button
              key={tt}
              type="button"
              onClick={() => {
                setTab(tt);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 text-sm font-black transition-colors ${
                tab === tt
                  ? "text-red-400 border-b-2 border-red-500 -mb-[2px]"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tt === "login" ? t("login") : t("signup")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              {t("password")}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 px-3 py-2 text-xs text-red-400 font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 px-3 py-2 text-xs text-emerald-400 font-bold">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
              loading
                ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
                : "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            {loading
              ? t("processing")
              : tab === "login"
                ? t("login")
                : t("createAccount")}
          </button>
        </form>

        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 text-xs text-white/40 hover:text-white/60 font-bold transition-colors"
        >
          {t("close")}
        </button>
      </div>
      </div>
    </div>,
    document.body
  );
}
