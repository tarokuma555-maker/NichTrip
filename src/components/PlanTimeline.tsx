"use client";

import { useState, useMemo, useRef } from "react";
import type { GeneratedPlan, PlanSpot } from "@/lib/types";
import SpotCard from "./SpotCard";
import MapView, { type MapSpot } from "./MapView";
import ShareButton from "./ShareButton";

/**
 * アクセス文言から移動手段アイコンを推定する
 */
function getTransportIcon(access: string): string {
  if (/徒歩|歩/.test(access)) return "🚶";
  if (/バス/.test(access)) return "🚌";
  if (/タクシー|車/.test(access)) return "🚗";
  if (/新幹線/.test(access)) return "🚅";
  if (/電車|JR|線|鉄道|メトロ/.test(access)) return "🚃";
  return "🚃";
}

/**
 * アクセス文言から所要時間のテキストを抽出する
 */
function extractDuration(access: string): string | null {
  const m = access.match(/約?\d+[〜~\-−]\d+分|\d+分/);
  return m ? m[0] : null;
}

function TransportConnector({ nextSpot }: { nextSpot: PlanSpot }) {
  const icon = getTransportIcon(nextSpot.access);
  const duration = extractDuration(nextSpot.access);

  return (
    <div className="flex items-center gap-2 py-1.5 pl-3">
      <span className="text-base">{icon}</span>
      <span className="text-xs text-navy/40">
        {duration ?? nextSpot.access}
      </span>
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
  const mapRef = useRef<HTMLDivElement>(null);

  /* ---- プランのスポットを MapView 用に変換 ---- */
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

  /** スポットカードの「地図」ボタン → マップにパン + スクロール */
  function handleLocate(globalIndex: number) {
    setFocusIndex(globalIndex);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // スポット通し番号
  let spotCounter = 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ===== プランヘッダー ===== */}
      <div className="text-center mb-10">
        <p className="inline-block bg-sub/10 text-sub text-xs font-bold px-3 py-1 rounded-full mb-3">
          AI Generated Plan
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mb-3 leading-tight">
          {plan.title}
        </h2>
        <p className="text-sm text-navy/60 leading-relaxed max-w-md mx-auto">
          {plan.summary}
        </p>

        {/* メタ情報 */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <MetaBadge emoji="💰" text={plan.total_budget_estimate} />
          <MetaBadge emoji="🌸" text={plan.best_season} />
          <MetaBadge emoji="📍" text={`全${allSpots.length}スポット`} />
        </div>
      </div>

      {/* ===== 日程タイムライン ===== */}
      <div className="space-y-10">
        {plan.days.map((day, dayIdx) => (
          <div key={day.day}>
            {/* Day ヘッダー */}
            <div className="flex items-center gap-3 mb-5">
              <div className="shrink-0 w-20 h-9 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center">
                Day {day.day}
              </div>
              <h3 className="text-lg font-bold text-navy">{day.title}</h3>
            </div>

            {/* タイムライン本体 */}
            <div className="relative ml-4 sm:ml-6">
              {/* 縦線 */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-navy/10 rounded-full" />

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
                          className={`absolute -left-8 sm:-left-10 top-5 w-4 h-4 rounded-full border-[3px] border-warm-50 ${
                            spotIdx === 0 ? "bg-accent" : "bg-sub"
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

                      {/* 移動コネクタ（最後のスポット以外） */}
                      {!isLast && nextSpot && (
                        <div className="relative">
                          <div
                            className="absolute -left-8 sm:-left-10 top-1/2 w-2 h-2 rounded-full bg-navy/10"
                            style={{
                              transform:
                                "translateX(calc(-50% + 1px)) translateY(-50%)",
                            }}
                          />
                          <TransportConnector nextSpot={nextSpot} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 終端ドット */}
              <div
                className="absolute -left-0 bottom-0 w-2 h-2 rounded-full bg-navy/20"
                style={{ transform: "translateX(calc(-50% + 1px))" }}
              />
            </div>

            {/* Day 間の区切り（最終日以外） */}
            {dayIdx < plan.days.length - 1 && (
              <div className="flex items-center gap-3 mt-6 ml-4 sm:ml-6 pl-8 sm:pl-10">
                <div className="flex-1 border-t border-dashed border-navy/10" />
                <span className="text-xs text-navy/30 shrink-0">🏨 宿泊</span>
                <div className="flex-1 border-t border-dashed border-navy/10" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== マップ ===== */}
      <div ref={mapRef} className="mt-12">
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
          <span>🗺️</span>
          ルートマップ
        </h3>
        <MapView
          spots={allSpots}
          dayGroups={dayGroups}
          focusIndex={focusIndex}
        />
        {/* Day カラー凡例 */}
        {dayGroups.length > 1 && (
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {dayGroups.map((_, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-navy/50">
                <span
                  className="w-3 h-3 rounded-full"
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
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
          <span>📤</span>
          プランを共有
        </h3>
        <ShareButton plan={plan} keyword={keyword} />
      </div>

      {/* ===== フッターアクション ===== */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl border-2 border-sub text-sub font-bold
                     hover:bg-sub hover:text-white transition-colors duration-200"
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
    <span className="inline-flex items-center gap-1.5 bg-warm-100 text-navy/60 text-xs font-medium px-3 py-1.5 rounded-full">
      <span>{emoji}</span>
      <span>{text}</span>
    </span>
  );
}
