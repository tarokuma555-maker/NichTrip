"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getRandomHotelAffiliates,
  getRandomRentalCarAffiliates,
  getRandomTourAffiliates,
  getActivityAffiliates,
  getMixedAffiliates,
  type A8Affiliate,
} from "@/lib/a8-affiliates";
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

type ContextType = "plan_form" | "loading" | "plan_result" | "pricing" | "feed" | "top";

function getContextAffiliates(context: ContextType): A8Affiliate[] {
  switch (context) {
    case "plan_form":
      return [...getRandomHotelAffiliates(2), ...getRandomTourAffiliates(1)];
    case "loading":
      return [...getRandomHotelAffiliates(2), ...getRandomRentalCarAffiliates(1)];
    case "plan_result":
      return getMixedAffiliates(4);
    case "pricing":
      return [...getRandomTourAffiliates(1), ...getRandomHotelAffiliates(2)];
    case "feed":
      return [...getActivityAffiliates(), ...getRandomHotelAffiliates(2)];
    case "top":
      return getMixedAffiliates(3);
    default:
      return getMixedAffiliates(3);
  }
}

const CONTEXT_MESSAGES: Record<ContextType, string> = {
  plan_form: "planFormMsg",
  loading: "loadingMsg",
  plan_result: "planResultMsg",
  pricing: "pricingMsg",
  feed: "feedMsg",
  top: "topMsg",
};

export default function ContextualAd({
  context,
}: {
  context: ContextType;
  keyword?: string;
}) {
  const { isPro } = useAuth();
  const t = useTranslations("Ads");
  const tDesc = useTranslations("AffiliateDesc");
  const affiliates = useMemo(() => getContextAffiliates(context), [context]);
  const [show, setShow] = useState(context !== "loading");

  useEffect(() => {
    if (context === "loading") {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [context]);

  if (isPro || affiliates.length === 0) return null;

  return (
    <div
      className={`relative transition-opacity duration-700 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-[11px] text-white/40 font-bold mb-3">
        {t(CONTEXT_MESSAGES[context])}
        <span className="text-white/20 ml-2 text-[9px]">PR</span>
      </p>
      <div className="flex flex-col gap-2">
        {affiliates.map((af) => (
          <a
            key={af.id}
            href={af.linkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`flex items-center gap-3 border-2 px-3 py-2.5 transition-colors ${CATEGORY_COLORS[af.category]}`}
          >
            <span className="opacity-60 shrink-0">
              <CategoryIcon category={af.category} className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-black block">{af.name}</span>
              <span className="text-[10px] text-white/40 truncate block">
                {tDesc(af.descKey)}
              </span>
            </div>
            <span className="text-[11px] font-black shrink-0">&rarr;</span>
          </a>
        ))}
      </div>
      {affiliates.map((af) => (
        <ImpPixel key={`imp-${af.id}`} url={af.impTagUrl} />
      ))}
    </div>
  );
}
