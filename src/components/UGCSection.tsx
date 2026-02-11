"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import PaywallModal from "@/components/PaywallModal";
import type { SpotReview, UGCData } from "@/lib/types";

type ReviewResult = { ok: boolean };

type Props = {
  spotName: string;
  workTitle: string;
  lat?: number;
  lng?: number;
  isExpanded: boolean;
};

export default function UGCSection({
  spotName,
  workTitle,
  lat,
  lng,
  isExpanded,
}: Props) {
  const { user, isPro } = useAuth();

  const [data, setData] = useState<UGCData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkinAnimating, setCheckinAnimating] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const hasFetched = useRef(false);

  const fetchUGC = useCallback(async () => {
    if (!spotName) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        spotName,
        workTitle: workTitle ?? "",
      });
      const res = await fetch(`/api/ugc?${params}`);
      if (res.ok) {
        const json: UGCData = await res.json();
        setData(json);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [spotName, workTitle]);

  useEffect(() => {
    if (isExpanded && !hasFetched.current) {
      hasFetched.current = true;
      fetchUGC();
    }
  }, [isExpanded, fetchUGC]);

  async function handleCheckin() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (data?.userCheckedIn) return;

    try {
      const res = await fetch("/api/ugc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkin",
          spotName,
          workTitle,
          lat,
          lng,
        }),
      });
      if (res.ok) {
        const { totalCheckins } = await res.json();
        setData((prev) =>
          prev
            ? { ...prev, userCheckedIn: true, checkinCount: totalCheckins }
            : prev
        );
        setCheckinAnimating(true);
        setTimeout(() => setCheckinAnimating(false), 800);
      }
    } catch {
      // silent
    }
  }

  async function handleReviewSubmit(review: {
    rating: number;
    comment: string;
    photoUrl: string | null;
    tips: string;
    bestAngle: string;
    visitedDate: string;
  }): Promise<ReviewResult> {
    try {
      const res = await fetch("/api/ugc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review", spotName, workTitle, ...review }),
      });
      if (res.ok) {
        setShowReviewForm(false);
        hasFetched.current = false;
        fetchUGC();
        return { ok: true };
      }
      return { ok: false };
    } catch {
      return { ok: false };
    }
  }

  const isCheckedIn = data?.userCheckedIn ?? false;
  const checkinCount = data?.checkinCount ?? 0;
  const reviews = data?.reviews ?? [];
  const totalReviewCount = data?.totalReviewCount ?? 0;
  const hiddenCount = totalReviewCount - reviews.length;

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* ===== チェックインボタン ===== */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={handleCheckin}
            disabled={isCheckedIn}
            className={`min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-black border-2 transition-all duration-200 ${
              isCheckedIn
                ? "bg-white/5 text-white/40 border-white/10 cursor-default"
                : "bg-transparent text-red-400 border-red-500 hover:bg-red-500 hover:text-white shadow-[2px_2px_0_rgba(229,62,62,0.3)]"
            }`}
          >
            {isCheckedIn ? "✓ 訪問済み" : "🎌 行った！"}
          </button>
          {checkinAnimating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="confetti-particle" />
              <div className="confetti-particle" />
              <div className="confetti-particle" />
              <div className="confetti-particle" />
              <div className="confetti-particle" />
              <div className="confetti-particle" />
            </div>
          )}
        </div>
        <span className="text-xs text-white/40 font-bold">
          {loading
            ? "..."
            : checkinCount > 0
              ? `${checkinCount}人が訪問`
              : "最初の訪問者になろう"}
        </span>
      </div>

      {/* ===== レビュー一覧 ===== */}
      {reviews.length > 0 && (
        <div>
          <p className="text-xs text-white/40 font-black mb-2 flex items-center gap-1">
            <span>📸</span> みんなの口コミ
            <span className="text-white/20">({totalReviewCount}件)</span>
          </p>
          <div className="space-y-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          {hiddenCount > 0 && !isPro && (
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className="mt-2 w-full py-2 text-xs text-red-400 font-black border-2 border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              他{hiddenCount}件のレビューはProプランで →
            </button>
          )}
        </div>
      )}

      {/* ===== レビュー投稿ボタン ===== */}
      <button
        type="button"
        onClick={() => {
          if (!user) {
            setShowAuth(true);
            return;
          }
          setShowReviewForm(true);
        }}
        className="w-full py-2.5 text-xs font-black text-white/60 border-2 border-white/10 hover:border-white/30 hover:text-white transition-all"
      >
        ✏️ レビューを書く
      </button>

      {/* ===== モーダル群 ===== */}
      {showReviewForm && (
        <ReviewFormModal
          spotName={spotName}
          workTitle={workTitle}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReviewForm(false)}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showPaywall && (
        <PaywallModal
          reason="ugc_review"
          onClose={() => setShowPaywall(false)}
          onLogin={() => {
            setShowPaywall(false);
            setShowAuth(true);
          }}
        />
      )}
    </div>
  );
}

/* ========== ReviewCard ========== */

function ReviewCard({ review }: { review: SpotReview }) {
  return (
    <div className="bg-white/5 border-2 border-white/10 p-3 shadow-[2px_2px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`text-xs ${n <= review.rating ? "text-yellow-400" : "text-white/10"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-[10px] text-white/20 font-bold">
          {new Date(review.created_at).toLocaleDateString("ja-JP")}
        </span>
      </div>

      {review.comment && (
        <p className="text-xs text-white/60 leading-relaxed mb-1.5">
          {review.comment}
        </p>
      )}

      {review.photo_url && (
        <div className="w-full h-32 bg-black/40 border-2 border-white/10 overflow-hidden mb-1.5">
          <img
            src={review.photo_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {review.tips && (
        <p className="text-[11px] text-white/40">
          <span className="font-black">💡 Tips:</span> {review.tips}
        </p>
      )}
      {review.best_angle && (
        <p className="text-[11px] text-white/40 mt-0.5">
          <span className="font-black">📐 アングル:</span> {review.best_angle}
        </p>
      )}
    </div>
  );
}

/* ========== ReviewFormModal ========== */

function ReviewFormModal({
  spotName,
  workTitle,
  onSubmit,
  onClose,
}: {
  spotName: string;
  workTitle: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    photoUrl: string | null;
    tips: string;
    bestAngle: string;
    visitedDate: string;
  }) => Promise<ReviewResult>;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tips, setTips] = useState("");
  const [bestAngle, setBestAngle] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("写真は5MB以下にしてください");
      return;
    }

    setUploading(true);
    setUploadError(false);
    try {
      const { createSupabaseBrowser } = await import("@/lib/supabase-browser");
      const supabase = createSupabaseBrowser();
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("review-photos")
        .upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage
          .from("review-photos")
          .getPublicUrl(path);
        setPhotoUrl(urlData.publicUrl);
      } else {
        setUploadError(true);
      }
    } catch {
      setUploadError(true);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    setSubmitError(false);
    const result = await onSubmit({ rating, comment, photoUrl, tips, bestAngle, visitedDate });
    if (!result.ok) {
      setSubmitError(true);
    }
    setSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[#111] border-2 border-white/20 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6 max-h-[85vh] overflow-y-auto">
        <h3 className="text-base font-black text-white mb-1">{spotName}</h3>
        <p className="text-xs text-white/30 mb-4 font-bold">{workTitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ★ 評価 */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              評価 *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-11 h-11 text-lg flex items-center justify-center border-2 transition-all ${
                    n <= rating
                      ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400"
                      : "bg-white/5 border-white/10 text-white/20 hover:border-white/30"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* コメント */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              コメント
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="manga-input w-full px-3 py-2.5 h-20 resize-none"
              placeholder="感想を書こう..."
            />
          </div>

          {/* 写真 */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              📷 写真
            </label>
            {photoUrl ? (
              <div className="relative w-full h-32 bg-black/40 border-2 border-white/10 overflow-hidden">
                <img
                  src={photoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white text-xs font-black flex items-center justify-center border border-white/20"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <label className="block w-full py-3 text-center text-xs font-bold text-white/40 border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer transition-colors">
                  {uploading ? "アップロード中..." : "写真を追加"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {uploadError && (
                  <p className="text-[11px] text-red-400 font-bold mt-1">
                    写真のアップロードに失敗しました
                  </p>
                )}
              </>
            )}
          </div>

          {/* Tips */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              💡 訪問のコツ
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
              placeholder="朝8時前が空いてて撮影しやすい"
            />
          </div>

          {/* ベストアングル */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              📐 おすすめアングル
            </label>
            <input
              type="text"
              value={bestAngle}
              onChange={(e) => setBestAngle(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
              placeholder="階段の下から見上げると同じ構図"
            />
          </div>

          {/* 訪問日 */}
          <div>
            <label className="block text-xs font-black text-white/60 mb-1">
              訪問日
            </label>
            <input
              type="date"
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
              className="manga-input w-full px-3 py-2.5"
            />
          </div>

          {/* エラー */}
          {submitError && (
            <p className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-2">
              投稿に失敗しました。もう一度お試しください。
            </p>
          )}

          {/* 送信 */}
          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
              rating === 0 || submitting
                ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
                : "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            {submitting ? "投稿中..." : "レビューを投稿する"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs text-white/30 hover:text-white/50 font-bold transition-colors"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
}
