"use client";

import { useState } from "react";
import type { PlanRequest, GeneratedPlan } from "@/lib/types";
import LoadingAnimation from "./LoadingAnimation";
import PlanTimeline from "./PlanTimeline";

type Phase = "form" | "loading" | "result" | "error";

const THEME_META: Record<
  PlanRequest["theme"],
  { emoji: string; label: string }
> = {
  pilgrimage: { emoji: "🎌", label: "アニメ聖地巡礼" },
  powerspot: { emoji: "⛩", label: "パワースポット巡り" },
  gourmet: { emoji: "🍜", label: "B級グルメツアー" },
};

const DAYS_OPTIONS: { label: string; value: number }[] = [
  { label: "日帰り", value: 1 },
  { label: "1泊2日", value: 2 },
  { label: "2泊3日", value: 3 },
];

const BUDGET_OPTIONS: { label: string; value: PlanRequest["budget"] }[] = [
  { label: "リーズナブル", value: "low" },
  { label: "ふつう", value: "medium" },
  { label: "贅沢", value: "high" },
];

const COMPANIONS_OPTIONS: {
  label: string;
  emoji: string;
  value: PlanRequest["companions"];
}[] = [
  { label: "ひとり", emoji: "🧑", value: "solo" },
  { label: "カップル", emoji: "💑", value: "couple" },
  { label: "友達", emoji: "👫", value: "friends" },
  { label: "家族", emoji: "👨‍👩‍👧", value: "family" },
];

export default function ConditionForm({
  theme,
  work,
}: {
  theme: PlanRequest["theme"];
  work?: string;
}) {
  const [departure, setDeparture] = useState("東京");
  const [days, setDays] = useState<number | null>(null);
  const [budget, setBudget] = useState<PlanRequest["budget"] | null>(null);
  const [companions, setCompanions] = useState<PlanRequest["companions"] | null>(null);
  const [keyword, setKeyword] = useState(work ?? "");

  const [phase, setPhase] = useState<Phase>("form");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const themeMeta = THEME_META[theme];

  const isReady =
    keyword.trim() !== "" &&
    departure.trim() !== "" &&
    days !== null &&
    budget !== null &&
    companions !== null;

  async function handleSubmit() {
    if (!isReady) return;

    setPhase("loading");
    setErrorMsg("");

    try {
      const body: PlanRequest = {
        theme,
        keyword: keyword.trim(),
        departure: departure.trim(),
        days: days!,
        budget: budget!,
        companions: companions!,
      };

      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        setErrorMsg("APIのレート制限です。少し待ってからもう一度お試しください。");
        setPhase("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error ?? "プランの生成に失敗しました。");
        setPhase("error");
        return;
      }

      const data: GeneratedPlan = await res.json();
      setPlan(data);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg("通信エラーが発生しました。ネットワークを確認してください。");
      setPhase("error");
    }
  }

  function handleReset() {
    setPlan(null);
    setPhase("form");
  }

  // ---------- Loading ----------
  if (phase === "loading") {
    return (
      <div className="w-full max-w-md mx-auto">
        <LoadingAnimation />
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === "result" && plan) {
    return <PlanTimeline plan={plan} keyword={keyword} onReset={handleReset} />;
  }

  // ---------- Form / Error ----------
  return (
    <div className="w-full max-w-md mx-auto">
      {/* テーマ表示 */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6">
        <span className="text-2xl">{themeMeta.emoji}</span>
        <div>
          <p className="text-xs text-white/40">選択中のテーマ</p>
          <p className="text-sm font-bold text-white">{themeMeta.label}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 作品名 */}
        {theme === "pilgrimage" && (
          <FormSection label="作品名">
            {work ? (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium">
                {work}
              </div>
            ) : (
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例: 君の名は。、ゆるキャン△"
                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3
                           text-white placeholder:text-white/30
                           focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                           transition-colors"
              />
            )}
          </FormSection>
        )}

        {/* 出発地 */}
        <FormSection label="出発地">
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="東京"
            className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3
                       text-white placeholder:text-white/30
                       focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                       transition-colors"
          />
        </FormSection>

        {/* 日数 */}
        <FormSection label="日数">
          <ChipGroup
            options={DAYS_OPTIONS.map((o) => ({
              key: String(o.value),
              label: o.label,
            }))}
            selected={days !== null ? String(days) : null}
            onSelect={(key) => setDays(Number(key))}
          />
        </FormSection>

        {/* 予算 */}
        <FormSection label="予算">
          <ChipGroup
            options={BUDGET_OPTIONS.map((o) => ({
              key: o.value,
              label: o.label,
            }))}
            selected={budget}
            onSelect={(key) => setBudget(key as PlanRequest["budget"])}
          />
        </FormSection>

        {/* 同行者 */}
        <FormSection label="同行者">
          <ChipGroup
            options={COMPANIONS_OPTIONS.map((o) => ({
              key: o.value,
              label: `${o.emoji} ${o.label}`,
            }))}
            selected={companions}
            onSelect={(key) =>
              setCompanions(key as PlanRequest["companions"])
            }
          />
        </FormSection>
      </div>

      {/* エラーメッセージ */}
      {phase === "error" && errorMsg && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* 送信ボタン */}
      <button
        onClick={handleSubmit}
        disabled={!isReady}
        className={`
          mt-8 w-full py-4 rounded-2xl text-base font-bold transition-all duration-200
          ${
            isReady
              ? "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-xl active:scale-[0.98]"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }
        `}
      >
        プランを作成する
      </button>

      {!isReady && (
        <p className="mt-2 text-center text-xs text-white/30">
          すべての項目を入力すると生成できます
        </p>
      )}
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function FormSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onSelect,
}: {
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`
              px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150
              ${
                active
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : "bg-white/5 border border-white/10 text-white/70 hover:border-white/30 hover:text-white"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
