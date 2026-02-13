"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { HotelItem } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import { getRandomHotelAffiliates } from "@/lib/a8-affiliates";
import A8ImpressionPixel from "@/components/A8ImpressionPixel";
import { IconHotel } from "@/components/ads/CategoryIcons";

function HotelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
      <path d="M3 11h18" />
      <path d="M9 5v6M15 5v6" />
      <rect x="6" y="14" width="4" height="4" rx="0.5" />
      <rect x="14" y="14" width="4" height="4" rx="0.5" />
    </svg>
  );
}

export default function HotelSuggestions({
  keyword,
  lat,
  lng,
  budget,
}: {
  keyword: string;
  lat?: number;
  lng?: number;
  budget?: string;
}) {
  const t = useTranslations("Hotel");
  const tDesc = useTranslations("AffiliateDesc");
  const locale = useLocale();
  const { isPro } = useAuth();
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const a8Hotels = useMemo(() => getRandomHotelAffiliates(4), []);

  useEffect(() => {
    if (!keyword && !lat) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (lat) params.set("lat", String(lat));
    if (lng) params.set("lng", String(lng));
    if (budget) params.set("budget", budget);
    params.set("locale", locale);

    fetch(`/api/affiliate/hotels?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setHotels(data.hotels ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword, lat, lng, budget, locale]);

  if (error || (!loading && hotels.length === 0)) return null;

  if (loading) {
    return (
      <div>
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
          <span className="text-white/60"><HotelIcon className="w-4 h-4" /></span>
          {t("recommended")}
        </h4>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-52 sm:w-60 shrink-0 bg-white/5 border-2 border-white/10 animate-pulse"
            >
              <div className="h-28 bg-white/10" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-32 bg-white/10" />
                <div className="h-3 w-20 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // アフィリエイトリンクがない場合（全件fallback）はPro限定
  const hasAffiliate = hotels.some((h) => h.source === "booking" || h.source === "rakuten");
  if (!hasAffiliate && !isPro) {
    return (
      <div>
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
          <span className="text-white/60"><HotelIcon className="w-4 h-4" /></span>
          {t("recommended")}
        </h4>
        <div className="bg-white/5 border-2 border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 font-bold mb-2">
            {t("countHotels", { count: hotels.length })}
          </p>
          <p className="text-[11px] text-white/30 mb-3">
            {t("proRequired")}
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-1 text-[11px] font-black text-red-400 border-2 border-red-500/30 px-3 py-1.5 hover:bg-red-500/10 transition-colors"
          >
            {t("viewProPlan")} <span className="text-[10px]">&rarr;</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
        <span className="text-white/60"><HotelIcon className="w-4 h-4" /></span>
        {t("recommended")}
      </h4>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {hotels.map((hotel, idx) => (
          <div
            key={idx}
            className="w-52 sm:w-60 shrink-0 bg-white/5 border-2 border-white/10 overflow-hidden"
          >
            {/* サムネイル */}
            {hotel.imageUrl ? (
              <div className="h-28 overflow-hidden border-b-2 border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-28 bg-white/5 border-b-2 border-white/10 flex items-center justify-center">
                <span className="text-white/20"><HotelIcon className="w-10 h-10" /></span>
              </div>
            )}

            {/* 情報 */}
            <div className="p-3">
              <h5 className="text-xs font-black text-white leading-snug line-clamp-2 mb-1.5">
                {hotel.name}
              </h5>

              <div className="flex items-center gap-2 mb-2">
                {hotel.rating && (
                  <span className="text-[11px] text-yellow-400 font-bold">
                    ★ {hotel.rating}
                  </span>
                )}
                <span className="text-sm font-black text-red-400">
                  {hotel.priceDisplay}
                </span>
              </div>

              {/* 特徴タグ */}
              {hotel.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {hotel.features.map((f, fi) => (
                    <span
                      key={fi}
                      className="text-[10px] text-white/40 font-bold bg-white/5 border border-white/10 px-1.5 py-0.5"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* 予約ボタン — A8アフィリエイト優先 */}
              <div className="flex gap-1.5 flex-wrap relative">
                <a
                  href={a8Hotels[idx % a8Hotels.length]?.linkUrl || hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-red-400 border-2 border-red-500/30 px-2.5 py-1
                             hover:bg-red-500/10 transition-colors"
                >
                  {t("compareRates")}（{a8Hotels[idx % a8Hotels.length]?.name}）
                  <span className="text-[10px]">&rarr;</span>
                </a>
                <A8ImpressionPixel url={a8Hotels[idx % a8Hotels.length]?.impTagUrl} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* A8 hotel affiliate links — 料金比較セクション */}
      <div className="mt-4 bg-white/[0.03] border border-white/10 p-3 relative">
        <p className="text-[11px] text-white/50 font-black mb-2.5 flex items-center gap-1.5">
          <IconHotel className="w-4 h-4 opacity-60" />
          {t("otherSites")}
          <span className="text-[9px] text-white/20 font-normal">PR</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {a8Hotels.map((af) => (
            <a
              key={af.id}
              href={af.linkUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-start gap-2 text-[11px] font-bold text-white/60 border border-white/15 px-2.5 py-2
                         hover:bg-red-500/5 hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <IconHotel className="w-3.5 h-3.5 opacity-40 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="block truncate font-black">{af.name}</span>
                <span className="block text-[9px] text-white/30 truncate">{tDesc(af.descKey)}</span>
              </div>
            </a>
          ))}
        </div>
        {a8Hotels.map((af) => (
          <A8ImpressionPixel key={`imp-${af.id}`} url={af.impTagUrl} />
        ))}
      </div>
    </div>
  );
}
