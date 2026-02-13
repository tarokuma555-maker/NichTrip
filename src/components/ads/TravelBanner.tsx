"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getAffiliatesByCategory, type A8Affiliate } from "@/lib/a8-affiliates";
import { useAuth } from "@/components/AuthProvider";

/* eslint-disable @next/next/no-img-element */

const CATEGORY_ICONS: Record<string, string> = {
  hotel: "\u{1F3E8}",
  tour: "\u{1F30D}",
  rental_car: "\u{1F697}",
  activity: "\u{1F3AF}",
  transport: "\u{1F68C}",
  mixed: "\u{2708}\u{FE0F}",
};

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
  const affiliates = useMemo(
    () => getAffiliatesByCategory(category, maxItems),
    [category, maxItems]
  );

  if (isPro || affiliates.length === 0) return null;

  if (variant === "horizontal") return <HorizontalBanner affiliates={affiliates} title={title} t={t} />;
  if (variant === "card") return <CardBanner affiliates={affiliates} title={title} category={category} t={t} />;
  if (variant === "inline") return <InlineBanner affiliates={affiliates} title={title} />;
  if (variant === "floating") return <FloatingBanner affiliates={affiliates} t={t} />;
  return null;
}

/* ===== Horizontal Banner ===== */
function HorizontalBanner({
  affiliates,
  title,
  t,
}: {
  affiliates: A8Affiliate[];
  title?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="py-8 sm:py-12">
      <div className="relative border-t border-b border-red-500/20 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white/70 truncate">
              {title || t("defaultTitle")}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">PR</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {affiliates.map((af) => (
              <a
                key={af.id}
                href={af.linkUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[11px] font-bold text-red-400 border border-red-500/30 px-3 py-1.5
                           hover:bg-red-500/10 transition-colors whitespace-nowrap"
              >
                {af.name} &rarr;
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
  category,
  t,
}: {
  affiliates: A8Affiliate[];
  title?: string;
  category: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {title && (
          <h3 className="text-sm font-black text-white/60 mb-3 flex items-center gap-2">
            <span>{CATEGORY_ICONS[category] || CATEGORY_ICONS.mixed}</span>
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
              className="block bg-white/5 border-2 border-white/10 p-4
                         hover:border-red-500/30 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{CATEGORY_ICONS[af.category]}</span>
                <span className="text-xs font-black text-white/80">{af.name}</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed mb-3">
                {af.fullName}
              </p>
              <span className="text-[11px] font-black text-red-400">
                {t("viewSite")} &rarr;
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
}: {
  affiliates: A8Affiliate[];
  title?: string;
}) {
  return (
    <div className="mt-4 mb-4 relative">
      {title && (
        <p className="text-[10px] text-white/25 mb-2">
          {title} <span className="text-white/15">PR</span>
        </p>
      )}
      <div className="flex gap-3 flex-wrap">
        {affiliates.map((af) => (
          <a
            key={af.id}
            href={af.linkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
          >
            &rarr; {af.name}
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
  t,
}: {
  affiliates: A8Affiliate[];
  t: ReturnType<typeof useTranslations>;
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
                      flex items-center gap-2 px-3 py-2 shadow-lg relative">
        <a
          href={af.linkUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 flex items-center gap-2 min-w-0"
        >
          <span className="text-[11px] font-bold text-white/60 truncate">
            {t("floatingText")}
          </span>
          <span className="text-[11px] font-black text-red-400 shrink-0">
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
