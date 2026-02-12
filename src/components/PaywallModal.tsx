"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type PaywallReason =
  | "usage_limit"
  | "multi_work"
  | "ai_chat"
  | "ugc_review"
  | "plan_save";

const REASON_MESSAGES: Record<PaywallReason, string> = {
  usage_limit: "今月の無料プラン生成回数（3回）を使い切りました。",
  multi_work: "複数作品のミックス巡礼はProプランの機能です。",
  ai_chat: "チャットカスタマイズはProプランの機能です。",
  ugc_review: "6件目以降のレビュー閲覧はProプランの機能です。",
  plan_save: "4件目以降のプラン保存はProプランの機能です。",
};

export default function PaywallModal({
  reason = "usage_limit",
  onClose,
  onLogin,
}: {
  reason?: PaywallReason;
  onClose: () => void;
  onLogin: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    if (!user) {
      onLogin();
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
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#111] border-2 border-red-500/50 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6 text-center">
        {/* アイコン */}
        <div className="w-12 h-12 mx-auto mb-4 bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        {/* メッセージ */}
        <h3 className="text-lg font-black text-white mb-2">
          Proプランにアップグレード
        </h3>
        <p className="text-sm text-white/50 mb-4 leading-relaxed">
          {REASON_MESSAGES[reason]}
        </p>

        {/* エラー */}
        {error && (
          <div className="mb-4 bg-red-500/10 border-2 border-red-500/30 px-3 py-2 text-xs text-red-400 font-bold">
            {error}
          </div>
        )}

        {/* 価格 */}
        <div className="bg-white/5 border-2 border-white/10 p-3 mb-6">
          <p className="text-xs text-white/40 font-bold">Proプラン</p>
          <p className="text-2xl font-black text-white">
            月額<span className="text-red-400">480</span>円〜
          </p>
          <p className="text-[11px] text-white/30">
            最初の3ヶ月間。4ヶ月目以降は月額980円
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
            loading
              ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
              : "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
          }`}
        >
          {loading ? "処理中..." : user ? "プロになる" : "ログインして始める"}
        </button>

        {/* 閉じる */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-xs text-white/30 hover:text-white/50 font-bold transition-colors"
        >
          あとで
        </button>
      </div>
    </div>
  );
}
