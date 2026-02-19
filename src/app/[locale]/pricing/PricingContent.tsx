"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/AuthProvider";
import PricingCard from "@/components/PricingCard";
import AuthModal from "@/components/AuthModal";
import TravelBanner from "@/components/ads/TravelBanner";

export default function PricingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const [showAuth, setShowAuth] = useState(false);
  const t = useTranslations("Pricing");
  const { isPro, proActivating, markCheckoutPending } = useAuth();
  const flagSetRef = useRef(false);

  // 決済成功でリダイレクトされたらフラグをセット（AuthProviderがポーリングを開始）
  useEffect(() => {
    if (success && !isPro && !flagSetRef.current) {
      flagSetRef.current = true;
      markCheckoutPending();
    }
  }, [success, isPro, markCheckoutPending]);

  const faqItems = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
    { q: t("faqQ6"), a: t("faqA6") },
  ];

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-5 py-12 pb-20">
        {/* 有効化中のスピナー（どのページから戻ってきても表示） */}
        {proActivating && !isPro && (
          <div className="mb-8 border-2 bg-white/5 border-white/10 p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
              <p className="text-white/50 font-bold text-sm">
                {t("activating")}
              </p>
            </div>
          </div>
        )}

        {/* 成功メッセージ */}
        {(success || proActivating) && isPro && (
          <div className="mb-8 border-2 bg-emerald-500/10 border-emerald-500/30 p-4 text-center">
            <p className="text-emerald-400 font-black text-sm">
              {t("successMessage")}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {t("successSub")}
            </p>
          </div>
        )}

        {canceled && (
          <div className="mb-8 bg-white/5 border-2 border-white/10 p-4 text-center">
            <p className="text-white/60 font-bold text-sm">
              {t("canceledMessage")}
            </p>
          </div>
        )}

        {/* ヒーロー */}
        <div className="text-center mb-12">
          <p className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">
            PRICING
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* プランカード */}
        <PricingCard onNeedAuth={() => setShowAuth(true)} />

        {/* 旅行予約広告 */}
        <TravelBanner variant="card" category="mixed" maxItems={4} title={t("adTravelDeals")} />

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-white mb-6 text-center">
            {t("faq")}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border-2 border-white/10 p-4"
              >
                <h3 className="text-sm font-black text-white mb-2">
                  Q. {item.q}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  A. {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 下部バナー */}
        <TravelBanner variant="horizontal" category="hotel" title={t("adHotelSearch")} />
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />
      )}
    </>
  );
}
