"use client";

import { useRef, useState, useCallback } from "react";
import type { GeneratedPlan } from "@/lib/types";

/* ============================================================
   Props
   ============================================================ */
type Props = {
  plan: GeneratedPlan;
  keyword: string; // 作品名（ハッシュタグ用）
};

/* ============================================================
   定数
   ============================================================ */
const SITE_URL = "https://nichtrip.vercel.app";

const DAY_COLORS = [
  "#E53E3E",
  "#3182CE",
  "#38A169",
  "#D69E2E",
  "#805AD5",
];

/* ============================================================
   メインコンポーネント
   ============================================================ */
export default function ShareButton({ plan, keyword }: Props) {
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ---------- X（Twitter）シェア ---------- */
  const tweetText = buildTweetText(plan, keyword);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  function handleShareX() {
    window.open(twitterUrl, "_blank", "noopener,noreferrer,width=550,height=420");
  }

  /* ---------- 画像保存 ---------- */
  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);

    try {
      // 動的インポート（クライアントのみ）
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#FFFBF5",
        useCORS: true,
        logging: false,
      });

      // ダウンロード
      const link = document.createElement("a");
      link.download = `nichtrip-${plan.title.slice(0, 20)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Image save failed:", e);
    } finally {
      setSaving(false);
    }
  }, [plan, saving]);

  return (
    <div className="space-y-4">
      {/* ---- ボタン行 ---- */}
      <div className="flex gap-3">
        {/* X シェア */}
        <button
          onClick={handleShareX}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                     bg-[#0f1419] text-white font-bold text-sm
                     hover:bg-[#272c30] active:scale-[0.98] transition-all"
        >
          <XIcon />
          Xでシェア
        </button>

        {/* 画像保存 */}
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                     bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-sm
                     hover:opacity-90 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <CameraIcon />
              画像として保存
            </>
          )}
        </button>
      </div>

      {/* ---- 画像化用の隠しカード（html2canvas でキャプチャ） ---- */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <div
          ref={cardRef}
          style={{ width: 1080, height: 1080, padding: 64, fontFamily: "sans-serif" }}
          className="bg-warm-50 flex flex-col"
        >
          <ShareCard plan={plan} keyword={keyword} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   画像化用カード（1080x1080 正方形）
   ============================================================ */
function ShareCard({
  plan,
  keyword,
}: {
  plan: GeneratedPlan;
  keyword: string;
}) {
  const totalSpots = plan.days.reduce((s, d) => s + d.spots.length, 0);

  return (
    <>
      {/* ヘッダー */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 20,
            color: "#3182CE",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          🗺️ NichTrip AI
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#1A365D",
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {plan.title}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#1A365D",
            opacity: 0.6,
            lineHeight: 1.6,
          }}
        >
          {plan.summary}
        </div>
      </div>

      {/* メタバッジ */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" as const }}>
        <Badge text={`💰 ${plan.total_budget_estimate}`} />
        <Badge text={`🌸 ${plan.best_season}`} />
        <Badge text={`📍 全${totalSpots}スポット`} />
      </div>

      {/* Day ごとのスポットリスト */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {plan.days.map((day) => (
          <div key={day.day} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  backgroundColor: DAY_COLORS[(day.day - 1) % DAY_COLORS.length],
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "4px 16px",
                  borderRadius: 999,
                }}
              >
                Day {day.day}
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1A365D" }}>
                {day.title}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {day.spots.map((spot, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #FEEBD2",
                    borderRadius: 12,
                    padding: "8px 14px",
                    fontSize: 15,
                    color: "#1A365D",
                    fontWeight: 500,
                  }}
                >
                  📍 {spot.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 24,
          borderTop: "2px dashed #FEEBD2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "#1A365D", opacity: 0.4 }}>
            #NichTrip #聖地巡礼 {keyword && `#${keyword.replace(/[.。！!？?\s]/g, "")}`}
          </div>
          <div style={{ fontSize: 14, color: "#3182CE", marginTop: 4 }}>
            {SITE_URL}
          </div>
        </div>
        {/* QR的なブランドマーク */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: "#1A365D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🗺️
        </div>
      </div>
    </>
  );
}

/* ============================================================
   ツイートテキスト生成
   ============================================================ */
function buildTweetText(plan: GeneratedPlan, keyword: string): string {
  const spots = plan.days
    .flatMap((d) => d.spots)
    .slice(0, 3)
    .map((s) => `📍${s.name}`)
    .join("\n");

  const workTag = keyword
    ? ` #${keyword.replace(/[.。！!？?\s]/g, "")}`
    : "";

  return [
    `🗺️ ${plan.title}`,
    "",
    plan.summary,
    "",
    spots,
    plan.days.flatMap((d) => d.spots).length > 3 ? "...ほか" : "",
    "",
    `💰 ${plan.total_budget_estimate} / 🌸 ${plan.best_season}`,
    "",
    `#NichTrip #聖地巡礼${workTag}`,
    SITE_URL,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ============================================================
   アイコン
   ============================================================ */
function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span
      style={{
        backgroundColor: "#FFF5E8",
        color: "#1A365D",
        opacity: 0.7,
        fontSize: 14,
        fontWeight: 600,
        padding: "6px 14px",
        borderRadius: 999,
      }}
    >
      {text}
    </span>
  );
}
