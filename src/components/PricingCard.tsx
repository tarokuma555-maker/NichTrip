"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type PlanTier = "free" | "pro";

const FREE_FEATURES = [
  { text: "プラン生成 月3回", included: true },
  { text: "1作品の聖地巡礼", included: true },
  { text: "チャット相談 月1回", included: true },
  { text: "交通チケット比較", included: true },
  { text: "宿泊施設比較", included: true },
  { text: "OGP画像付きシェア", included: true },
  { text: "UGCレビュー投稿", included: true },
  { text: "UGCレビュー閲覧（5件/スポット）", included: true },
  { text: "プラン保存 3件まで", included: true },
];

const PRO_FEATURES = [
  { text: "プラン生成 無制限", included: true },
  { text: "複数作品ミックス巡礼", included: true, highlight: true },
  { text: "チャット相談 無制限", included: true },
  { text: "交通チケット比較", included: true },
  { text: "宿泊施設比較", included: true },
  { text: "OGP画像付きシェア", included: true },
  { text: "UGCレビュー投稿", included: true },
  { text: "UGCレビュー閲覧 無制限", included: true },
  { text: "プラン保存 無制限", included: true },
];

export default function PricingCard({
  onNeedAuth,
}: {
  onNeedAuth: () => void;
}) {
  const { user, isPro } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) {
      onNeedAuth();
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
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "管理ページの読み込みに失敗しました");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {error && (
        <div className="mb-4 bg-red-500/10 border-2 border-red-500/30 px-4 py-3 text-sm text-red-400 font-bold">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 無料プラン */}
      <TierCard
        tier="free"
        price="¥0"
        period="/月"
        features={FREE_FEATURES}
        ctaLabel={isPro ? "現在のプラン" : "現在のプラン"}
        ctaDisabled
        isCurrentPlan={!isPro}
      />

      {/* プロプラン */}
      <TierCard
        tier="pro"
        price="¥480"
        period="/月"
        subPrice="4ヶ月目以降 ¥980/月"
        promoBanner="今なら3ヶ月間 月480円！"
        features={PRO_FEATURES}
        ctaLabel={
          isPro
            ? "サブスクリプション管理"
            : loading
              ? "処理中..."
              : "プロになる"
        }
        ctaDisabled={loading}
        onCtaClick={isPro ? handlePortal : handleCheckout}
        isCurrentPlan={isPro}
        isHighlighted
      />
      </div>
    </div>
  );
}

function TierCard({
  tier,
  price,
  period,
  subPrice,
  promoBanner,
  features,
  ctaLabel,
  ctaDisabled,
  onCtaClick,
  isCurrentPlan,
  isHighlighted,
}: {
  tier: PlanTier;
  price: string;
  period: string;
  subPrice?: string;
  promoBanner?: string;
  features: { text: string; included: boolean; highlight?: boolean }[];
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCtaClick?: () => void;
  isCurrentPlan?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div
      className={`relative border-2 p-6 ${
        isHighlighted
          ? "border-red-500 shadow-[4px_4px_0_rgba(229,62,62,0.4)] bg-[#111]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {/* プロモバナー */}
      {promoBanner && (
        <div className="absolute -top-4 left-4 right-4 bg-red-500 text-white text-xs font-black text-center py-1.5 shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          {promoBanner}
        </div>
      )}

      {/* ティア名 */}
      <div className="mt-2 mb-4">
        <p className="text-xs font-black text-white/40 uppercase tracking-wider">
          {tier === "free" ? "FREE PLAN" : "PRO PLAN"}
        </p>
      </div>

      {/* 価格 */}
      <div className="mb-1">
        <span className="text-4xl font-black text-white">{price}</span>
        <span className="text-sm text-white/40 font-bold ml-1">{period}</span>
      </div>
      {subPrice && (
        <p className="text-xs text-white/30 mb-4">{subPrice}</p>
      )}
      {!subPrice && <div className="mb-4" />}

      {/* 機能リスト */}
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className={`shrink-0 w-4 h-4 flex items-center justify-center text-[10px] font-black mt-0.5 ${
                f.included
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/30"
              }`}
            >
              {f.included ? "✓" : "—"}
            </span>
            <span
              className={`text-sm ${
                f.highlight
                  ? "text-red-400 font-black"
                  : f.included
                    ? "text-white/70"
                    : "text-white/30"
              }`}
            >
              {f.text}
              {f.highlight && (
                <span className="ml-1.5 text-[10px] bg-red-500/20 border border-red-500/30 text-red-400 px-1.5 py-0.5 font-black">
                  NEW
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* CTAボタン */}
      <button
        onClick={onCtaClick}
        disabled={ctaDisabled}
        className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
          isHighlighted && !isCurrentPlan
            ? "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
            : isCurrentPlan
              ? "bg-white/5 text-white/40 border-white/10 cursor-default"
              : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
        } ${ctaDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isCurrentPlan && !isHighlighted && "✓ "}
        {ctaLabel}
      </button>
    </div>
  );
}
