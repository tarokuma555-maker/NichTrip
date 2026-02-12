"use client";

import { useState, useMemo, useRef } from "react";
import type { GeneratedPlan, PlanSpot } from "@/lib/types";
import SpotCard from "./SpotCard";
import MapView, { type MapSpot } from "./MapView";
import ShareButton from "./ShareButton";
import TransportOptions from "./TransportOptions";
import HotelSuggestions from "./HotelSuggestions";
import { useAuth } from "@/components/AuthProvider";
import ProBanner from "./ProBanner";
import { getWorkVisual, hasPoster } from "@/lib/work-visuals";
import Image from "next/image";

type TransportMode = "train" | "car" | "walk" | "taxi";

const TRANSPORT_MODES: { key: TransportMode; label: string }[] = [
  { key: "train", label: "電車" },
  { key: "car", label: "車" },
  { key: "walk", label: "徒歩" },
  { key: "taxi", label: "タクシー" },
];

/* ===== SVG Outline Icons ===== */

function IconTrain({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8" cy="19" r="1" />
      <circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  );
}

function IconCar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  );
}

function IconWalk({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="4" r="2" />
      <path d="M14 8l-2 4-3 3 2 5M10 12l-3 3-2 5M14 8l3 5" />
    </svg>
  );
}

function IconTaxi({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
      <rect x="10" y="1" width="4" height="3" rx="1" />
    </svg>
  );
}

function IconMoney({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function IconSeason({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconMap({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
      <path d="M8 2v16M16 6v16" />
    </svg>
  );
}

function IconShare({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconHotel({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 011-1h10a1 1 0 011 1v3M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
}

const TRANSPORT_ICON_MAP: Record<TransportMode, React.ReactNode> = {
  train: <IconTrain className="w-4 h-4" />,
  car: <IconCar className="w-4 h-4" />,
  walk: <IconWalk className="w-4 h-4" />,
  taxi: <IconTaxi className="w-4 h-4" />,
};

/**
 * 住所から目的地名を抽出（都道府県+市区町村レベル）
 */
function extractDestination(address: string | undefined, fallback: string): string {
  if (!address) return fallback;
  // 「〇〇県〇〇市」「〇〇府〇〇市」「東京都〇〇区」のパターンを抽出
  const m = address.match(/^(.+?[都道府県])(.+?[市区町村])/);
  if (m) return m[1] + m[2]; // 例: "神奈川県鎌倉市"
  // 都道府県だけでも取れれば使う
  const m2 = address.match(/^(.+?[都道府県])/);
  if (m2) return m2[1];
  // マッチしない場合はfallback
  return fallback;
}

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
): { text: string; detail: string } {
  const durationStr = extractDuration(access);
  const minutes = extractMinutes(access);

  switch (mode) {
    case "train":
      return {
        text: durationStr ?? access,
        detail: access,
      };
    case "car":
      return {
        text: minutes
          ? `車で約${Math.max(5, minutes - 5)}〜${minutes + 5}分`
          : "車でのルート",
        detail: "一般道利用 ※高速道路利用で短縮可能",
      };
    case "walk":
      return {
        text: minutes
          ? `徒歩約${minutes * 3}〜${minutes * 4}分`
          : "徒歩ルート",
        detail: "※距離が長い場合は他の交通手段をおすすめします",
      };
    case "taxi":
      return {
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
      <span className="text-white/40 mt-0.5">{TRANSPORT_ICON_MAP[mode]}</span>
      <div className="min-w-0">
        <span className="text-xs text-white/60 font-bold">{info.text}</span>
        {mode === "train" && info.detail !== info.text && (
          <p className="text-[11px] text-white/30 mt-0.5 leading-relaxed break-words">
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
  departure,
  budget,
  companions,
}: {
  plan: GeneratedPlan;
  keyword: string;
  onReset: () => void;
  departure?: string;
  budget?: string;
  companions?: string;
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

  const visual = getWorkVisual(keyword);
  const showPoster = hasPoster(keyword);

  let spotCounter = 0;
  const dest = extractDestination(plan.days[0]?.spots[0]?.address, keyword);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ===== プランヘッダー ===== */}
      <div className="text-center mb-10">
        {/* アニメポスター */}
        {showPoster && (
          <div className="relative w-32 h-44 mx-auto mb-4 border-[3px] border-white shadow-[4px_4px_0_rgba(229,62,62,0.4)]">
            <Image
              src={visual.image}
              alt={keyword}
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          </div>
        )}

        <p className="inline-block bg-red-500/10 text-red-400 text-xs font-black px-3 py-1 border-2 border-red-500/30 mb-2">
          {keyword}
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
          {plan.title}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto break-words">
          {plan.summary}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <MetaBadge icon={<IconMoney className="w-3.5 h-3.5" />} text={plan.total_budget_estimate} />
          <MetaBadge icon={<IconSeason className="w-3.5 h-3.5" />} text={plan.best_season} />
          <MetaBadge icon={<IconPin className="w-3.5 h-3.5" />} text={`全${allSpots.length}スポット`} />
        </div>
      </div>

      {/* ===== 上部: 旅行サービス広告 ===== */}
      <TravelAds departure={departure} destination={dest} />

      {/* ===== 無料プランの制限 + Pro誘導 ===== */}
      <FreeLimitsBanner />

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
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== アフィリエイト: 行き方 ===== */}
      {departure && (
        <TransportOptions
          from={departure}
          to={extractDestination(plan.days[0]?.spots[0]?.address, keyword)}
          companions={companions}
        />
      )}

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
                          workTitle={keyword}
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
              <>
                <div className="flex items-center gap-3 mt-6 ml-4 sm:ml-6 pl-8 sm:pl-10">
                  <div className="flex-1 border-t-2 border-dashed border-white/10" />
                  <span className="text-xs text-white/30 shrink-0 font-bold flex items-center gap-1.5">
                    <IconHotel className="w-3.5 h-3.5" />
                    宿泊
                  </span>
                  <div className="flex-1 border-t-2 border-dashed border-white/10" />
                </div>
                <div className="mt-4 ml-4 sm:ml-6 pl-8 sm:pl-10">
                  <HotelSuggestions
                    keyword={day.title}
                    lat={day.spots[day.spots.length - 1]?.lat}
                    lng={day.spots[day.spots.length - 1]?.lng}
                    budget={budget}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ===== マップ ===== */}
      <div ref={mapRef} className="mt-12">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <IconMap className="w-5 h-5 text-white/60" />
          ルートマップ
          <span className="text-xs font-normal text-white/40 ml-2">
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

      {/* ===== 下部: 旅行サービス広告 ===== */}
      <TravelAds departure={departure} destination={dest} />

      {/* ===== シェア ===== */}
      <div className="mt-12">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <IconShare className="w-5 h-5 text-white/60" />
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

function MetaBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/60 text-xs font-bold px-3 py-1.5 border border-white/10">
      <span className="text-white/40">{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function TravelAds({ departure, destination }: { departure?: string; destination: string }) {
  const ads = [
    {
      icon: <IconHotel className="w-5 h-5" />,
      title: "宿泊予約",
      desc: `${destination}周辺のホテル・旅館を検索`,
      url: `https://www.booking.com/searchresults.ja.html?ss=${encodeURIComponent(destination)}&lang=ja`,
      cta: "Booking.comで探す",
      color: "text-red-400 border-red-500/30 hover:bg-red-500/10",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2L4 7v4l8-3 8 3V7l-8-5zM4 11l8 3 8-3M4 11v4l8 5 8-5v-4" />
        </svg>
      ),
      title: "航空券",
      desc: departure ? `${departure} → ${destination} のフライトを検索` : "航空券を検索",
      url: "https://www.aviasales.com/?marker=594814",
      cta: "航空券を検索",
      color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10",
    },
    {
      icon: <IconCar className="w-5 h-5" />,
      title: "レンタカー",
      desc: "自由に聖地をめぐるならレンタカーが便利",
      url: "https://www.discovercars.com/",
      cta: "レンタカーを探す",
      color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10",
    },
    {
      icon: <IconTaxi className="w-5 h-5" />,
      title: "タクシー配車",
      desc: "駅から聖地スポットへの移動に便利",
      url: "https://m.uber.com/",
      cta: "Uberで配車",
      color: "text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10",
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        旅行に役立つサービス
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {ads.map((ad, i) => (
          <a
            key={i}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`block border-2 p-3 transition-colors ${ad.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="opacity-60">{ad.icon}</span>
              <span className="text-xs font-black">{ad.title}</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed mb-2">
              {ad.desc}
            </p>
            <span className="text-[11px] font-black">
              {ad.cta} &rarr;
            </span>
          </a>
        ))}
      </div>
      <p className="text-[9px] text-white/20 mt-2 text-center">
        AD — Proプランで広告を非表示にできます
      </p>
    </div>
  );
}

function FreeLimitsBanner() {
  const { isPro } = useAuth();

  if (isPro) return null;

  const limits = [
    { free: "プラン生成 月3回まで", pro: "無制限" },
    { free: "1作品のみ", pro: "最大3作品ミックス" },
    { free: "レビュー閲覧 5件/スポット", pro: "無制限" },
    { free: "プラン保存 3件まで", pro: "無制限" },
  ];

  return (
    <div className="mb-8 border-2 border-white/10 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-white/[0.03] px-4 py-3 border-b border-white/10">
        <p className="text-xs font-black text-white/60 uppercase tracking-wider">
          現在のプラン: <span className="text-white/40">FREE</span>
        </p>
      </div>

      {/* 制限リスト */}
      <div className="p-4 space-y-2.5">
        {limits.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="shrink-0 w-4 h-4 border border-white/20 flex items-center justify-center text-white/20 text-[8px]">
              —
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-white/40 line-through">{item.free}</span>
            </div>
            <span className="text-[11px] text-red-400 font-black shrink-0">
              Pro: {item.pro}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <ProBanner
          variant="inline"
          message="すべての制限を解除してプロプランにアップグレード"
        />
      </div>
    </div>
  );
}
