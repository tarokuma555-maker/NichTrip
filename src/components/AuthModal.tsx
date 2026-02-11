"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

type Tab = "login" | "signup";

export default function AuthModal({
  onClose,
  defaultTab = "login",
}: {
  onClose: () => void;
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createSupabaseBrowser();

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
        setSuccess(
          "確認メールを送信しました。メールのリンクをクリックしてください。"
        );
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(
          err.message === "Invalid login credentials"
            ? "メールアドレスまたはパスワードが正しくありません"
            : err.message
        );
      } else {
        onClose();
      }
    }

    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#111] border-2 border-white/20 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6">
        {/* タブ */}
        <div className="flex border-b-2 border-white/10 mb-6">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 text-sm font-black transition-colors ${
                tab === t
                  ? "text-red-400 border-b-2 border-red-500 -mb-[2px]"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {t === "login" ? "ログイン" : "新規登録"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              メールアドレス
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
              パスワード
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
              placeholder="6文字以上"
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
              ? "処理中..."
              : tab === "login"
                ? "ログイン"
                : "アカウント作成"}
          </button>
        </form>

        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 text-xs text-white/40 hover:text-white/60 font-bold transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
