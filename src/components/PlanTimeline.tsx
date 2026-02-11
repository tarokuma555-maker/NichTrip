"use client";

import { useState, useMemo, useRef } from "react";
import type { GeneratedPlan, PlanSpot } from "@/lib/types";
import SpotCard from "./SpotCard";
import MapView, { type MapSpot } from "./MapView";
import ShareButton from "./ShareButton";

type TransportMode = "train" | "car" | "walk" | "taxi";

const TRANSPORT_MODES: { key: TransportMode; label: string; icon: string }[] = [
  { key: "train", label: "電車", icon: "🚃" },
  { key: "car", label: "車", icon: "🚗" },
  { key: "walk", label: "徒歩", icon: "🚶" },
  { key: "taxi", label: "タクシー", icon: "🚕" },
];

/**
 * アクセス文言から所要時間（分）を抽出
 */
function extractMinutes(access: string): number | null {
  const m = access.match(/(\d+)[〜~\-−](\d+)分/);
  if (m) return Math.round((parseInt(m[1]) + parseInt(m[2])) / 2);
  const m2 = access.match(/(\d+)分/);
  if (m2) return parseInt(m2[1]);
  return null;
}

/**
 * アクセス文言から所要時間テキストを抽出
 */
function extractDuration(access: string): string | null {
  const m = access.match(/約?\d+[〜~\-−]\d+分|\d+分/);
  return m ? m[0] : null;
}

/**
 * 選択された交通手段に応じた移動情報を推定
 */
function getTransportInfo(
  access: string,
  mode: TransportMode
): { icon: string; text: string; detail: string } {
  const durationStr = extractDuration(access);
  const minutes = extractMinutes(access);

  switch (mode) {
    case "train":
      return {
        icon: "🚃",
        text: durationStr ?? access,
        detail: access,
      };
    case "car":
      return {
        icon: "🚗",
        text: minutes
          ? `車で約${Math.max(5, minutes - 5)}〜${minutes + 5}分`
          : "車でのルート",
        detail: "一般道利用 ※高速道路利用で短縮可能",
      };
    case "walk":
      return {
        icon: "🚶",
        text: minutes
          ? `徒歩約${minutes * 3}〜${minutes * 4}分`
          : "徒歩ルート",
        detail: "※距離が長い場合は他の交通手段をおすすめします",
      };
    case "taxi":
      return {
        icon: "🚕",
        text: minutes
          ? `タクシーで約${Math.max(3, minutes - 5)}〜${minutes}分`
          : "タクシーでの移動",
        detail: minutes
          ? `推定料金: ¥${(Math.round((minutes * 80) / 100) * 100).toLocaleString()}〜¥${(Math.round((minutes * 120) / 100) * 100).toLocaleString()}`
          : "※料金は距離・時間帯により変動",
      };
  }
}

function TransportConnector({
  nextSpot,
  mode,
}: {
  nextSpot: PlanSpot;
  mode: TransportMode;
}) {
  const info = getTransportInfo(nextSpot.access, mode);

  return (
    <div className="flex items-start gap-2 py-2 pl-3">
      <span className="text-base">{info.icon}</span>
      <div className="min-w-0">
        <span className="text-xs text-white/60 font-bold">{info.text}</span>
        {mode === "train" && info.detail !== info.text && (
          <p className="text-[11px] text-white/30 mt-0.5 leading-relaxed break-all">
            {info.detail}
          </p>
        )}
        {mode !== "train" && (
          <p className="text-[11px] text-white/30 mt-0.5">{info.detail}</p>
        )}
      </div>
    </div>
  );
}

export default function PlanTimeline({
  plan,
  keyword,
  onReset,
}: {
  plan: GeneratedPlan;
  keyword: string;
  onReset: () => void;
}) {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>("train");
  const mapRef = useRef<HTMLDivElement>(null);

  const { allSpots, dayGroups } = useMemo(() => {
    const all: MapSpot[] = [];
    const groups: MapSpot[][] = [];
    let counter = 0;

    plan.days.forEach((day) => {
      const group: MapSpot[] = [];
      day.spots.forEach((spot) => {
        counter++;
        const ms: MapSpot = {
          lat: spot.lat,
          lng: spot.lng,
          name: spot.name,
          dayNumber: day.day,
          globalIndex: counter,
        };
        all.push(ms);
        group.push(ms);
      });
      groups.push(group);
    });

    return { allSpots: all, dayGroups: groups };
  }, [plan]);

  function handleLocate(globalIndex: number) {
    setFocusIndex(globalIndex);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  let spotCounter = 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ===== プランヘッダー ===== */}
      <div className="text-center mb-10">
        <p className="inline-block bg-red-500/10 text-red-400 text-xs font-black px-3 py-1 border-2 border-red-500/30 mb-3">
          AI Generated Plan
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
          {plan.title}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto">
          {plan.summary}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <MetaBadge emoji="💰" text={plan.total_budget_estimate} />
          <MetaBadge emoji="🌸" text={plan.best_season} />
          <MetaBadge emoji="📍" text={`全${allSpots.length}スポット`} />
        </div>
      </div>

      {/* ===== 移動手段タブ ===== */}
      <div className="mb-8">
        <p className="text-xs text-white/40 font-black uppercase tracking-wider mb-3">
          Transport Mode
        </p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {TRANSPORT_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setTransportMode(m.key)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all duration-150 border-2
                ${
                  transportMode === m.key
                    ? "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }
              `}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== 日程タイムライン ===== */}
      <div className="space-y-10">
        {plan.days.map((day, dayIdx) => (
          <div key={day.day}>
            {/* Day ヘッダー */}
            <div className="flex items-center gap-3 mb-5">
              <div className="shrink-0 px-5 h-9 bg-white text-[#0a0a0a] text-sm font-black flex items-center justify-center shadow-[3px_3px_0_rgba(229,62,62,0.4)]">
                Day {day.day}
              </div>
              <h3 className="text-lg font-black text-white">{day.title}</h3>
            </div>

            {/* タイムライン本体 */}
            <div className="relative ml-4 sm:ml-6">
              {/* 縦線 */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10" />

              <div className="pl-8 sm:pl-10 space-y-0">
                {day.spots.map((spot, spotIdx) => {
                  spotCounter++;
                  const currentIndex = spotCounter;
                  const isLast = spotIdx === day.spots.length - 1;
                  const nextSpot = day.spots[spotIdx + 1];

                  return (
                    <div key={spotIdx}>
                      {/* ドット */}
                      <div className="relative">
                        <div
                          className={`absolute -left-8 sm:-left-10 top-5 w-4 h-4 border-[3px] border-[#0a0a0a] ${
                            spotIdx === 0 ? "bg-red-500" : "bg-white"
                          }`}
                          style={{
                            transform: "translateX(calc(-50% + 1px))",
                          }}
                        />

                        {/* スポットカード */}
                        <SpotCard
                          spot={spot}
                          index={currentIndex}
                          onLocate={() => handleLocate(currentIndex)}
                        />
                      </div>

                      {/* 移動コネクタ */}
                      {!isLast && nextSpot && (
                        <div className="relative">
                          <div
                            className="absolute -left-8 sm:-left-10 top-1/2 w-2 h-2 bg-white/10"
                            style={{
                              transform:
                                "translateX(calc(-50% + 1px)) translateY(-50%)",
                            }}
                          />
                          <TransportConnector
                            nextSpot={nextSpot}
                            mode={transportMode}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 終端ドット */}
              <div
                className="absolute -left-0 bottom-0 w-2 h-2 bg-white/20"
                style={{ transform: "translateX(calc(-50% + 1px))" }}
              />
            </div>

            {/* Day 間の区切り */}
            {dayIdx < plan.days.length - 1 && (
              <div className="flex items-center gap-3 mt-6 ml-4 sm:ml-6 pl-8 sm:pl-10">
                <div className="flex-1 border-t-2 border-dashed border-white/10" />
                <span className="text-xs text-white/30 shrink-0 font-bold">🏨 宿泊</span>
                <div className="flex-1 border-t-2 border-dashed border-white/10" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== マップ ===== */}
      <div ref={mapRef} className="mt-12">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <span>🗺️</span>
          ルートマップ
          <span className="text-xs font-normal text-white/40 ml-2">
            {TRANSPORT_MODES.find((m) => m.key === transportMode)?.icon}{" "}
            {TRANSPORT_MODES.find((m) => m.key === transportMode)?.label}モード
          </span>
        </h3>
        <MapView
          spots={allSpots}
          dayGroups={dayGroups}
          focusIndex={focusIndex}
          transportMode={transportMode}
        />
        {/* Day カラー凡例 */}
        {dayGroups.length > 1 && (
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {dayGroups.map((_, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-white/50">
                <span
                  className="w-3 h-3"
                  style={{
                    backgroundColor: [
                      "#E53E3E",
                      "#3182CE",
                      "#38A169",
                      "#D69E2E",
                      "#805AD5",
                    ][i % 5],
                  }}
                />
                Day {i + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== シェア ===== */}
      <div className="mt-12">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <span>📤</span>
          プランを共有
        </h3>
        <ShareButton plan={plan} keyword={keyword} />
      </div>

      {/* ===== フッターアクション ===== */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onReset}
          className="w-full py-3.5 border-2 border-white/20 text-white/60 font-black
                     hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-200
                     shadow-[3px_3px_0_rgba(255,255,255,0.05)]"
        >
          条件を変えてもう一度作る
        </button>
      </div>
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function MetaBadge({ emoji, text }: { emoji: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/60 text-xs font-bold px-3 py-1.5 border border-white/10">
      <span>{emoji}</span>
      <span>{text}</span>
    </span>
  );
}
