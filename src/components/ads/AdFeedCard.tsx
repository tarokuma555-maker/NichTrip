"use client";

import { type AdFeedCardData, HOTEL_AFFILIATES, TOUR_AFFILIATES, TRANSPORT_AFFILIATES, RENTAL_CAR_AFFILIATES, ACTIVITY_AFFILIATES } from "@/lib/a8-affiliates";

/* eslint-disable @next/next/no-img-element */

const ALL_AFFILIATES_MAP = new Map(
  [...HOTEL_AFFILIATES, ...TOUR_AFFILIATES, ...TRANSPORT_AFFILIATES, ...RENTAL_CAR_AFFILIATES, ...ACTIVITY_AFFILIATES]
    .map(a => [a.id, a])
);

export default function AdFeedCard({ ad }: { ad: AdFeedCardData }) {
  const affiliate = ALL_AFFILIATES_MAP.get(ad.affiliateId);
  if (!affiliate) return null;

  return (
    <a
      href={affiliate.linkUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block"
    >
      <article className="bg-white/5 border-2 border-white/10 overflow-hidden hover:border-amber-500/30 transition-colors">
        {/* ヘッダー - FeedCardと同じ構造 */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">{ad.displayName}</p>
            <p className="text-[10px] text-amber-400/60 font-bold truncate">{ad.tagline}</p>
          </div>
          <span className="text-[10px] text-amber-400/60 font-bold bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20 shrink-0">
            PR
          </span>
        </div>

        {/* 写真 - FeedCardと同じ */}
        <div className="w-full aspect-[4/3] bg-black/40 overflow-hidden border-y-2 border-white/10">
          <img
            src={ad.photoUrl}
            alt={ad.displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* コンテンツ - FeedCardと同じ構造 */}
        <div className="px-4 py-3 space-y-2">
          <p className="text-sm text-white/70 leading-relaxed">{ad.description}</p>

          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400/60 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 21h6M12 3a6 6 0 014 10.5V17H8v-3.5A6 6 0 0112 3z" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black text-amber-400/60">{ad.tip1Label}:</span> {ad.tip1Text}
            </p>
          </div>

          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400/60 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black text-amber-400/60">{ad.tip2Label}:</span> {ad.tip2Text}
            </p>
          </div>

          {/* フッター */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-white/20 font-bold">提携旅行サイト</span>
            <span className="text-[10px] text-amber-400/60 font-bold flex items-center gap-1">
              詳しく見る &rarr;
            </span>
          </div>
        </div>

        {/* impタグ */}
        <img
          src={affiliate.impTagUrl}
          width={1}
          height={1}
          alt=""
          style={{ border: "none", position: "absolute", visibility: "hidden" }}
          aria-hidden="true"
        />
      </article>
    </a>
  );
}
