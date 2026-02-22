"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type RakutenHotel = {
  id: number;
  name: string;
  description: string;
  minPrice: number | null;
  address: string;
  access: string;
  nearestStation: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  bookingUrl: string;
  infoUrl: string;
  reviewCount: number;
  reviewAverage: number | null;
};

export default function NearbyHotels({
  lat,
  lng,
  isExpanded,
}: {
  lat: number;
  lng: number;
  isExpanded: boolean;
}) {
  const t = useTranslations("NearbyHotels");
  const [hotels, setHotels] = useState<RakutenHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!isExpanded || fetched || !lat || !lng) return;
    setLoading(true);
    fetch(`/api/rakuten-hotels?lat=${lat}&lng=${lng}&radius=3&hits=5`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.hotels)) setHotels(data.hotels);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setFetched(true);
      });
  }, [isExpanded, fetched, lat, lng]);

  if (!isExpanded) return null;
  if (fetched && hotels.length === 0 && !loading) return null;

  return (
    <div className="bg-white/5 border-2 border-white/10 p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <HotelIcon />
        <p className="text-xs text-white/40 font-bold">{t("title")}</p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="shrink-0 w-48 border-2 border-white/10 bg-white/[0.03] animate-pulse"
            >
              <div className="h-28 bg-white/5" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
                <div className="h-6 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hotel cards */}
      {!loading && hotels.length > 0 && (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {hotels.map((hotel) => (
            <a
              key={hotel.id}
              href={hotel.bookingUrl || hotel.infoUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 w-48 border-2 border-white/10 bg-white/[0.03]
                         hover:border-red-500/30 hover:-translate-y-0.5
                         shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0_rgba(229,62,62,0.2)]
                         transition-all duration-200 block"
            >
              {/* Image */}
              <div className="relative h-28 bg-black/40 overflow-hidden">
                {hotel.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <HotelIcon size="lg" />
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

              {/* Info */}
              <div className="p-2.5">
                <p className="text-xs font-black text-white truncate">{hotel.name}</p>
                <p className="text-[10px] text-white/40 truncate mt-0.5">
                  {hotel.access || hotel.nearestStation}
                </p>
                {/* Book button */}
                <div className="mt-2 bg-red-500/10 border border-red-500/30 px-2 py-1.5 text-center">
                  <span className="text-[10px] font-black text-red-400">
                    {t("bookOnRakuten")} &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Powered by label */}
      {!loading && hotels.length > 0 && (
        <p className="text-[9px] text-white/20 mt-2 text-right">{t("poweredBy")}</p>
      )}
    </div>
  );
}

function HotelIcon({ size }: { size?: "lg" }) {
  const cls = size === "lg" ? "w-8 h-8" : "w-4 h-4";
  return (
    <svg
      className={`${cls} text-white/60`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
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
