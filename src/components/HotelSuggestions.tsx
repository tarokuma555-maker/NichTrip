"use client";

import { useState, useEffect } from "react";
import type { HotelItem } from "@/lib/types";

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
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
  }, [keyword, lat, lng, budget]);

  if (error || (!loading && hotels.length === 0)) return null;

  if (loading) {
    return (
      <div>
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
          <span>🏨</span>
          この日のおすすめ宿
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
        <span>🏨</span>
        この日のおすすめ宿
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
                <span className="text-3xl opacity-20">🏨</span>
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

              {/* 予約ボタン */}
              <a
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-[11px] font-black text-red-400 border-2 border-red-500/30 px-2.5 py-1
                           hover:bg-red-500/10 transition-colors"
              >
                予約する
                <span className="text-[10px]">&rarr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
