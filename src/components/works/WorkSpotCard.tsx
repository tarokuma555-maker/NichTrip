"use client";

import { useTranslations } from "next-intl";
import type { WorkSpot } from "@/lib/works-data";

type WorkSpotCardProps = {
  spot: WorkSpot;
  index: number;
  onLocate?: () => void;
};

export default function WorkSpotCard({ spot, index, onLocate }: WorkSpotCardProps) {
  const t = useTranslations("WorkDetail");

  return (
    <div className="border-2 border-white/10 bg-white/[0.03] transition-colors duration-200 hover:border-white/20">
      {/* ===== Header row ===== */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Numbered badge */}
          <span className="shrink-0 w-7 h-7 bg-red-500 text-white flex items-center justify-center text-xs font-black shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
            {index}
          </span>

          {/* Spot name */}
          <h4 className="flex-1 min-w-0 text-sm font-black text-white truncate">
            {spot.name}
          </h4>

          {/* Locate button */}
          {onLocate && (
            <button
              type="button"
              onClick={onLocate}
              className="shrink-0 flex items-center gap-0.5 text-[11px] text-red-400 hover:text-red-300
                         font-black transition-colors border border-red-500/30 px-1.5 py-0.5"
              aria-label={t("locateOnMap")}
            >
              <PinIcon />
              <span className="hidden sm:inline">{t("locateOnMap")}</span>
            </button>
          )}
        </div>
      </div>

      {/* ===== Body (always visible) ===== */}
      <div className="px-4 pb-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-1.5">
          <span className="shrink-0 mt-px text-white/40">
            <PinIconSmall />
          </span>
          <p className="text-[11px] text-white/40 leading-relaxed break-words">
            {spot.address}
          </p>
        </div>

        {/* Scene description (manga-style panel) */}
        {spot.scene_description && (
          <div className="border-l-2 border-red-500/30 pl-3 bg-white/[0.03] py-2 pr-3">
            {spot.episode && (
              <p className="text-[10px] text-red-400 font-bold mb-1">
                {spot.episode}
              </p>
            )}
            <p className="text-xs text-white/50 leading-relaxed break-words">
              {spot.scene_description}
            </p>
          </div>
        )}

        {/* Access info */}
        {spot.access_info && (
          <div className="flex items-start gap-1.5">
            <span className="shrink-0 mt-px text-white/40">
              <TrainIcon />
            </span>
            <p className="text-[11px] text-white/40 leading-relaxed break-words">
              {spot.access_info}
            </p>
          </div>
        )}

        {/* Tags */}
        {spot.tags && spot.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== Icon sub-components ========== */

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

function PinIconSmall() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8" />
      <circle cx="8" cy="19" r="1" />
      <circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  );
}
