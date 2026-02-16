"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { getRandomHotelAffiliates } from "@/lib/a8-affiliates";
import A8ImpressionPixel from "@/components/A8ImpressionPixel";
import { IconHotel } from "@/components/ads/CategoryIcons";
import { rakutenSearchUrl } from "@/lib/rakuten-affiliate";

type RakutenHotel = {
  id: number;
  name: string;
  minPrice: number | null;
  access: string;
  nearestStation: string;
  imageUrl: string | null;
  bookingUrl: string;
  reviewAverage: number | null;
};

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

function StarIcon() {
  return (
    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HotelSuggestions({
  keyword,
  lat,
  lng,
}: {
  keyword: string;
  lat?: number;
  lng?: number;
  budget?: string;
}) {
  const t = useTranslations("Hotel");
  const tDesc = useTranslations("AffiliateDesc");
  const [hotels, setHotels] = useState<RakutenHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const a8Hotels = useMemo(() => getRandomHotelAffiliates(4), []);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    fetch(`/api/rakuten-hotels?lat=${lat}&lng=${lng}&radius=3&hits=5`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.hotels)) setHotels(data.hotels);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lng]);

  if (error && a8Hotels.length === 0) return null;

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

  return (
    <div>
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
        <span className="text-white/60"><HotelIcon className="w-4 h-4" /></span>
        {t("recommended")}
      </h4>

      {/* 楽天トラベルホテルカード（プライマリ） */}
      {hotels.length > 0 && (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {hotels.map((hotel) => (
            <a
              key={hotel.id}
              href={hotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-52 sm:w-60 shrink-0 bg-white/5 border-2 border-white/10 overflow-hidden
                         hover:border-red-500/30 hover:-translate-y-0.5
                         shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0_rgba(229,62,62,0.2)]
                         transition-all duration-200 block"
            >
              {/* サムネイル */}
              <div className="relative h-28 bg-black/40 overflow-hidden">
                {hotel.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <HotelIcon className="w-10 h-10" />
                  </div>
                )}
                {/* Price badge */}
                {hotel.minPrice && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                    <p className="text-xs font-black text-white">
                      ¥{hotel.minPrice.toLocaleString()}
                      <span className="text-[10px] text-white/50 font-bold">〜</span>
                    </p>
                  </div>
                )}
                {/* Review badge */}
                {hotel.reviewAverage && hotel.reviewAverage > 0 && (
                  <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
                    <StarIcon />
                    {hotel.reviewAverage.toFixed(1)}
                  </div>
                )}
              </div>

              {/* 情報 */}
              <div className="p-3">
                <h5 className="text-xs font-black text-white leading-snug line-clamp-2 mb-1">
                  {hotel.name}
                </h5>
                <p className="text-[10px] text-white/40 truncate mb-2">
                  {hotel.access || hotel.nearestStation}
                </p>
                {/* 予約ボタン */}
                <div className="bg-red-500/10 border border-red-500/30 px-2 py-1.5 text-center">
                  <span className="text-[10px] font-black text-red-400">
                    {t("bookOnRakuten")} &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* 楽天トラベルが取得できなかった場合のフォールバック */}
      {hotels.length === 0 && (
        <div className="bg-white/5 border-2 border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 font-bold mb-2">
            {keyword} {t("nearbyHotels")}
          </p>
          <a
            href={rakutenSearchUrl(keyword)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-[11px] font-black text-red-400 border-2 border-red-500/30 px-3 py-1.5 hover:bg-red-500/10 transition-colors"
          >
            {t("searchOnRakuten")} <span className="text-[10px]">&rarr;</span>
          </a>
        </div>
      )}

      {hotels.length > 0 && (
        <p className="text-[9px] text-white/20 mt-2 text-right">{t("poweredByRakuten")}</p>
      )}

      {/* A8 hotel affiliate links — 他の予約サイト */}
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
