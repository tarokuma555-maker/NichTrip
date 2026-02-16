"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PlanSpot } from "@/lib/types";
import { RESTAURANT_AFFILIATES } from "@/lib/a8-affiliates";
import A8ImpressionPixel from "@/components/A8ImpressionPixel";
import UGCSection from "./UGCSection";
import NearbyHotels from "./NearbyHotels";

export default function SpotCard({
  spot,
  index,
  onLocate,
  workTitle,
}: {
  spot: PlanSpot;
  index: number;
  onLocate?: () => void;
  workTitle?: string;
}) {
  const t = useTranslations("SpotCard");
  const [open, setOpen] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
      }}
      className="w-full text-left bg-white/5 border-2 border-white/10
                 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 cursor-pointer"
    >
      {/* ===== ヘッダー（常に表示） ===== */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          {/* 番号バッジ（四角） */}
          <span className="shrink-0 w-7 h-7 bg-red-500 text-white text-xs font-black flex items-center justify-center mt-0.5 shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
            {index}
          </span>

          <div className="flex-1 min-w-0">
            {/* スポット名 + 滞在時間 */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-base font-black text-white leading-snug">
                {spot.name}
              </h4>
              <span className="shrink-0 flex items-center gap-1 text-xs text-white/50 bg-white/5 border border-white/10 px-2 py-1 font-bold">
                <ClockIcon />
                {t("minutes", { min: spot.stay_minutes })}
              </span>
            </div>

            {/* 住所 + 地図ボタン */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-white/30 truncate">{spot.address}</p>

              {onLocate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocate();
                  }}
                  className="shrink-0 flex items-center gap-0.5 text-[11px] text-red-400 hover:text-red-300
                             font-black transition-colors border border-red-500/30 px-1.5 py-0.5"
                  aria-label={t("map")}
                >
                  <PinIcon />
                  {t("map")}
                </button>
              )}
            </div>

            {/* アニメシーン（プレビュー1行） */}
            {spot.anime_scene && !open && (
              <p className="text-xs text-red-400/70 mt-2 truncate font-bold">
                {spot.anime_scene}
              </p>
            )}
          </div>

          {/* 開閉シェブロン */}
          <svg
            className={`shrink-0 w-5 h-5 text-white/30 mt-1 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ===== 展開コンテンツ ===== */}
      <div
        className={`grid transition-all duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            {/* 区切り線 */}
            <div className="border-t-2 border-white/10" />

            {/* ロケーション写真（Street View） */}
            {spot.lat && spot.lng && (
              <div className="relative w-full h-40 bg-black/40 border-2 border-white/10 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${spot.lat},${spot.lng}&fov=90&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}`}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <p className="text-[10px] text-white/50 font-bold">Street View</p>
                </div>
              </div>
            )}

            {/* アニメシーン + 差し絵 */}
            {spot.anime_scene && (
              <div className="bg-red-500/10 border-2 border-red-500/20 p-3">
                {/* シーン描写 */}
                <div className="relative w-full mb-3 bg-black/40 border-2 border-white/10 overflow-hidden p-4">
                  {/* 集中線背景 */}
                  <div className="absolute inset-0 speed-lines-bg opacity-20" />
                  {/* コマ枠の角装飾 */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/40" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/40" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/40" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/40" />
                  {/* シーン描写テキスト */}
                  <div className="relative text-center">
                    <p className="text-xs text-white/30 font-black tracking-wider mb-1">
                      SCENE
                    </p>
                    <p className="text-sm text-white/80 font-bold leading-relaxed break-words">
                      {spot.anime_scene}
                    </p>
                    {spot.episode && (
                      <p className="text-[11px] text-red-400/60 mt-1 font-bold">
                        {spot.episode}
                      </p>
                    )}
                  </div>
                </div>

                {/* アニメシーン画像検索リンク */}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent((workTitle ?? "") + " " + spot.name + " 聖地 アニメ シーン")}&tbm=isch`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-black text-red-400 border border-red-500/30 px-2.5 py-1.5
                             hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t("searchScene")}
                  <span className="text-[10px]">&rarr;</span>
                </a>
              </div>
            )}

            {/* アクセス */}
            <DetailRow icon={<AccessIcon />} label={t("access")} value={spot.access} />

            {/* ヒント */}
            <DetailRow icon={<TipsIcon />} label={t("tips")} value={spot.tips} />

            {/* グルメ */}
            {spot.nearby_food && (
              <div className="bg-white/5 border-2 border-white/10 p-3">
                <div className="flex items-start gap-2">
                  <span className="text-white/60 mt-px"><FoodIcon /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 mb-0.5 font-bold">{t("nearbyFood")}</p>
                    <p className="text-sm font-black text-white">
                      {spot.nearby_food.name}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {spot.nearby_food.genre} / {spot.nearby_food.budget}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {RESTAURANT_AFFILIATES.map((af) => (
                        <span key={af.id} className="relative">
                          <a
                            href={af.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-black text-red-400 border border-red-500/30 px-2.5 py-1
                                       hover:bg-red-500/10 transition-colors"
                          >
                            <RestaurantSearchIcon />
                            {t(`af_${af.id}`)}
                            <span className="text-[10px]">&rarr;</span>
                          </a>
                          <A8ImpressionPixel url={af.impTagUrl} />
                        </span>
                      ))}
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(spot.nearby_food.name + " " + (spot.address ?? ""))}/@${spot.lat},${spot.lng},15z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-white/40 border border-white/20 px-2.5 py-1
                                   hover:bg-white/10 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {t("viewOnMap")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 近くのホテル（楽天トラベル） */}
            {spot.lat && spot.lng && (
              <NearbyHotels lat={spot.lat} lng={spot.lng} isExpanded={open} />
            )}

            {/* UGC: チェックイン & レビュー */}
            <div className="border-t-2 border-white/10 pt-3">
              <UGCSection
                spotName={spot.name}
                workTitle={workTitle ?? ""}
                lat={spot.lat}
                lng={spot.lng}
                isExpanded={open}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-white/60 mt-px">{icon}</span>
      <div>
        <p className="text-xs text-white/40 font-bold">{label}</p>
        <p className="text-sm text-white/70 leading-relaxed break-words">{value}</p>
      </div>
    </div>
  );
}

function AccessIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8" />
      <circle cx="8" cy="19" r="1" /><circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  );
}

function TipsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 21h6M12 3a6 6 0 014 10.5V17H8v-3.5A6 6 0 0112 3z" />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3v7a4 4 0 004 4h2" />
      <path d="M7 3v4" />
      <path d="M3 7h8" />
      <path d="M9 14v8" />
      <path d="M18 3v18" />
      <path d="M18 3a3 3 0 013 3v1a3 3 0 01-3 3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function RestaurantSearchIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
