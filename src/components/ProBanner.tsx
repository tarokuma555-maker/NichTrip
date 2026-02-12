"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "./AuthModal";

export default function ProBanner({
  variant = "card",
  message,
  className = "",
}: {
  variant: "inline" | "card";
  message?: string;
  className?: string;
}) {
  const { user, isPro } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isPro) return null;

  async function handleCta() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "決済ページの作成に失敗しました");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("決済URLの取得に失敗しました");
      }
    } catch {
      router.push("/pricing");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "inline") {
    return (
      <>
        <div className={`mt-2 flex items-center gap-2 flex-wrap ${className}`}>
          <span className="text-[10px] font-black text-red-400 border border-red-500/30 px-1.5 py-0.5">
            PRO
          </span>
          <span className="text-[11px] text-white/40">
            {message ?? "複数作品ミックス巡礼"}
          </span>
          <button
            type="button"
            onClick={handleCta}
            disabled={loading}
            className="text-[11px] text-red-400 font-black hover:text-red-300 transition-colors"
          >
            {loading ? "..." : "プロプランに登録 →"}
          </button>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />}
      </>
    );
  }

  // card variant
  return (
    <>
      <div
        className={`bg-gradient-to-r from-red-500/10 to-red-900/10 border-2 border-red-500/30 p-5 ${className}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-black text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5">
            PRO PLAN
          </span>
        </div>

        <p className="text-sm font-bold text-white/80 mb-1">
          {message ?? "複数の作品をミックスして巡礼プランを作成"}
        </p>

        {error && (
          <div className="mb-3 bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-bold text-left">
            {error}
          </div>
        )}

        <ul className="space-y-1 mb-4">
          <li className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-3.5 h-3.5 bg-emerald-500 flex items-center justify-center text-white text-[8px] font-black shrink-0">
              ✓
            </span>
            プラン生成 無制限
          </li>
          <li className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-3.5 h-3.5 bg-emerald-500 flex items-center justify-center text-white text-[8px] font-black shrink-0">
              ✓
            </span>
            複数作品ミックス巡礼
          </li>
          <li className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-3.5 h-3.5 bg-emerald-500 flex items-center justify-center text-white text-[8px] font-black shrink-0">
              ✓
            </span>
            レビュー全件閲覧
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-white">
            月額480円〜
          </span>
          <button
            onClick={handleCta}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-4 py-2 border-2 border-red-400/50
                       shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)]
                       hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "処理中..." : "プロになる →"}
          </button>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />}
    </>
  );
}
