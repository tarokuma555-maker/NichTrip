"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getAffiliatesByCategory, type A8Affiliate } from "@/lib/a8-affiliates";
import { useAuth } from "@/components/AuthProvider";
import { CategoryIcon, CATEGORY_COLORS } from "@/components/ads/CategoryIcons";

/* eslint-disable @next/next/no-img-element */

function ImpPixel({ url }: { url: string }) {
  return (
    <img
      src={url}
      width={1}
      height={1}
      alt=""
      loading="lazy"
      aria-hidden="true"
      style={{ border: "none", position: "absolute", visibility: "hidden", pointerEvents: "none" }}
    />
  );
}

const CATEGORY_CTA_KEYS: Record<string, string> = {
  hotel: "ctaHotel",
  tour: "ctaTour",
  rental_car: "ctaCar",
  transport: "ctaBus",
  activity: "ctaActivity",
};

export default function TravelBanner({
  variant,
  category = "mixed",
  maxItems = 3,
  title,
}: {
  variant: "horizontal" | "card" | "inline" | "floating";
  category?: "hotel" | "tour" | "rental_car" | "activity" | "mixed";
  maxItems?: number;
  title?: string;
}) {
  const { isPro } = useAuth();
  const t = useTranslations("Ads");
  const tDesc = useTranslations("AffiliateDesc");
  const affiliates = useMemo(
    () => getAffiliatesByCategory(category, maxItems),
    [category, maxItems]
  );

  if (isPro || affiliates.length === 0) return null;

  if (variant === "horizontal") return <HorizontalBanner affiliates={affiliates} title={title} t={t} tDesc={tDesc} />;
  if (variant === "card") return <CardBanner affiliates={affiliates} title={title} t={t} tDesc={tDesc} />;
  if (variant === "inline") return <InlineBanner affiliates={affiliates} title={title} tDesc={tDesc} />;
  if (variant === "floating") return <FloatingBanner affiliates={affiliates} tDesc={tDesc} />;
  return null;
}

type TransFn = ReturnType<typeof useTranslations>;

/* ===== Horizontal Banner ===== */
function HorizontalBanner({
  affiliates,
  title,
  t,
  tDesc,
}: {
  affiliates: A8Affiliate[];
  title?: string;
  t: TransFn;
  tDesc: TransFn;
}) {
  return (
    <section className="py-6">
      <div className="border-t border-b border-white/10 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] text-white/25 font-bold">
              {title || t("defaultTitle")}
            </p>
            <span className="text-[9px] text-white/15">PR</span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {affiliates.map((af) => (
              <a
                key={af.id}
                href={af.linkUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`flex items-center gap-3 shrink-0 border-2 px-4 py-3 transition-colors ${CATEGORY_COLORS[af.category]}`}
              >
                <span className="opacity-60">
                  <CategoryIcon category={af.category} className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-black block">{af.name}</span>
                  <span className="text-[10px] text-white/40 block whitespace-nowrap">
                    {tDesc(af.descKey)}
                  </span>
                </div>
                <span className="text-[11px] font-black shrink-0 ml-2">&rarr;</span>
              </a>
            ))}
          </div>
        </div>
        {affiliates.map((af) => (
          <ImpPixel key={`imp-${af.id}`} url={af.impTagUrl} />
        ))}
      </div>
    </section>
  );
}

/* ===== Card Banner ===== */
function CardBanner({
  affiliates,
  title,
  t,
  tDesc,
}: {
  affiliates: A8Affiliate[];
  title?: string;
  t: TransFn;
  tDesc: TransFn;
}) {
  return (
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {title && (
          <h3 className="text-sm font-black text-white/60 mb-3 flex items-center gap-2">
            {title}
            <span className="text-[9px] text-white/20 font-normal ml-auto">PR</span>
          </h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative">
          {affiliates.map((af) => (
            <a
              key={af.id}
              href={af.linkUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`block border-2 p-4 transition-colors ${CATEGORY_COLORS[af.category]}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="opacity-60">
                  <CategoryIcon category={af.category} className="w-5 h-5" />
                </span>
                <span className="text-xs font-black">{af.name}</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed mb-3">
                {tDesc(af.descKey)}
              </p>
              <span className="text-[11px] font-black">
                {t(CATEGORY_CTA_KEYS[af.category] || "viewSite")} &rarr;
              </span>
            </a>
          ))}
          {affiliates.map((af) => (
            <ImpPixel key={`imp-${af.id}`} url={af.impTagUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Inline Banner ===== */
function InlineBanner({
  affiliates,
  title,
  tDesc,
}: {
  affiliates: A8Affiliate[];
  title?: string;
  tDesc: TransFn;
}) {
  return (
    <div className="mt-4 mb-4 relative">
      {title && (
        <p className="text-[10px] text-white/25 mb-2">
          {title} <span className="text-white/15">PR</span>
        </p>
      )}
      <div className="flex gap-2 flex-wrap">
        {affiliates.map((af) => (
          <a
            key={af.id}
            href={af.linkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-bold transition-colors ${CATEGORY_COLORS[af.category]}`}
          >
            <CategoryIcon category={af.category} className="w-3.5 h-3.5 opacity-60" />
            <span className="font-black">{af.name}</span>
            <span className="text-white/30 hidden sm:inline text-[10px]">{tDesc(af.descKey)}</span>
            <span className="shrink-0">&rarr;</span>
          </a>
        ))}
      </div>
      {affiliates.map((af) => (
        <ImpPixel key={`imp-${af.id}`} url={af.impTagUrl} />
      ))}
    </div>
  );
}

/* ===== Floating Banner ===== */
function FloatingBanner({
  affiliates,
  tDesc,
}: {
  affiliates: A8Affiliate[];
  tDesc: TransFn;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("animetrips_ad_dismissed");
    if (stored) {
      const ts = parseInt(stored, 10);
      if (Date.now() - ts < 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 600) setVisible(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  const af = affiliates[0];

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-1">
      <div className="max-w-md mx-auto bg-black/90 border border-red-500/20 backdrop-blur-sm
                      flex items-center gap-3 px-4 py-2.5 shadow-lg relative">
        <span className="opacity-60 shrink-0">
          <CategoryIcon category={af.category} className="w-4 h-4 text-red-400" />
        </span>
        <a
          href={af.linkUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 flex items-center gap-2 min-w-0"
        >
          <span className="text-[11px] font-bold text-white/60 truncate">
            {tDesc(af.descKey)}
          </span>
          <span className="text-[11px] font-black text-red-400 shrink-0 whitespace-nowrap">
            {af.name} &rarr;
          </span>
        </a>
        <button
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("animetrips_ad_dismissed", String(Date.now()));
          }}
          className="text-white/30 hover:text-white/60 text-xs shrink-0 ml-1"
          aria-label="close"
        >
          &times;
        </button>
        <ImpPixel url={af.impTagUrl} />
        <span className="text-[8px] text-white/15 absolute -top-3 right-1">PR</span>
      </div>
    </div>
  );
}
