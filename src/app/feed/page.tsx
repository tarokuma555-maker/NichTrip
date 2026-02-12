"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import type { SpotReview } from "@/lib/types";

const FREE_POST_LIMIT = 3;

export default function FeedPage() {
  const { user, isPro } = useAuth();
  const [reviews, setReviews] = useState<SpotReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showPaywall = !isPro && reviews.length > FREE_POST_LIMIT;
  const visibleReviews = showPaywall
    ? reviews.slice(0, FREE_POST_LIMIT)
    : reviews;

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleUpgrade() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error ?? "決済ページの作成に失敗しました");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError("決済URLの取得に失敗しました");
      }
    } catch {
      setCheckoutError("通信エラーが発生しました");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 className="text-base font-black text-white">みんなの巡礼レポート</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border-2 border-white/10 p-4 animate-pulse">
                <div className="h-4 w-32 bg-white/10 mb-3" />
                <div className="h-48 bg-white/10 mb-3" />
                <div className="h-3 w-full bg-white/10 mb-2" />
                <div className="h-3 w-2/3 bg-white/10" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-white/30 font-bold">まだ投稿がありません</p>
            <p className="text-xs text-white/20 mt-1">
              聖地を訪れたらレビューを投稿しよう
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <FeedCard key={review.id} review={review} />
              ))}
            </div>

            {/* ペイウォール */}
            {showPaywall && (
              <div className="relative mt-4">
                {/* 暗くなるフェードアウト */}
                <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none z-10" />

                {/* ペイウォールオーバーレイ */}
                <div className="relative z-20 py-12 flex flex-col items-center">
                  <div className="w-full max-w-sm bg-[#111] border-2 border-red-500/40 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6 text-center">
                    <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>

                    <h3 className="text-base font-black text-white mb-2">
                      これ以上見るにはProプラン
                    </h3>
                    <p className="text-xs text-white/40 mb-1 leading-relaxed">
                      他の旅行者のレポートをすべて閲覧できます
                    </p>
                    <p className="text-xs text-white/30 mb-5">
                      残り{reviews.length - FREE_POST_LIMIT}件の投稿
                    </p>

                    {checkoutError && (
                      <div className="mb-4 bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-bold">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                      className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
                        checkoutLoading
                          ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
                          : "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
                      }`}
                    >
                      {checkoutLoading ? "処理中..." : user ? "プロプランに登録" : "ログインして始める"}
                    </button>

                    <p className="text-[11px] text-white/20 mt-3">
                      月額480円〜
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

/* ========== Feed Card ========== */

function FeedCard({ review }: { review: SpotReview }) {
  return (
    <article className="bg-white/5 border-2 border-white/10 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <div className="w-7 h-7 bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate">{review.spot_name}</p>
          {review.work_title && (
            <p className="text-[10px] text-red-400/60 font-bold truncate">{review.work_title}</p>
          )}
        </div>
        <div className="flex gap-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`text-[10px] ${n <= review.rating ? "text-yellow-400" : "text-white/10"}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* 写真 */}
      {review.photo_url && (
        <div className="w-full aspect-[4/3] bg-black/40 overflow-hidden border-y-2 border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.photo_url}
            alt={review.spot_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* コンテンツ */}
      <div className="px-4 py-3 space-y-2">
        {review.comment && (
          <p className="text-sm text-white/70 leading-relaxed">{review.comment}</p>
        )}

        {review.tips && (
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 21h6M12 3a6 6 0 014 10.5V17H8v-3.5A6 6 0 0112 3z" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black">Tips:</span> {review.tips}
            </p>
          </div>
        )}

        {review.best_angle && (
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black">アングル:</span> {review.best_angle}
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-white/20 font-bold">
            {review.visited_date
              ? new Date(review.visited_date).toLocaleDateString("ja-JP")
              : new Date(review.created_at).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>
    </article>
  );
}
