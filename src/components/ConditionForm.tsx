"use client";

import { useState, useEffect, useRef } from "react";
import type { PlanRequest, GeneratedPlan } from "@/lib/types";
import LoadingAnimation from "./LoadingAnimation";
import PlanTimeline from "./PlanTimeline";

type Phase = "form" | "loading" | "result" | "error";

type WorkItem = {
  id: string;
  title: string;
  title_en: string;
  genre: string;
  year: number;
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

  // 作品検索用
  const [allWorks, setAllWorks] = useState<WorkItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  // 作品一覧を取得
  useEffect(() => {
    fetch("/api/works")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllWorks(data);
      })
      .catch(() => {});
  }, []);

  // 外側クリックでサジェスト閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredWorks = allWorks.filter((w) => {
    if (!keyword.trim()) return true;
    const q = keyword.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.title_en.toLowerCase().includes(q) ||
      w.genre.toLowerCase().includes(q)
    );
  });

  // 入力された作品名がDBに存在するか判定
  const exactMatch = keyword.trim()
    ? allWorks.find(
        (w) =>
          w.title === keyword.trim() ||
          w.title_en.toLowerCase() === keyword.trim().toLowerCase()
      )
    : null;

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
      <div className="space-y-6">
        {/* 作品名（検索付き） */}
        <FormSection label="作品名">
          {work ? (
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium">
              {work}
            </div>
          ) : (
            <div ref={suggestRef} className="relative">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="作品名を検索..."
                  className="w-full bg-white/5 border-2 border-white/10 rounded-xl pl-10 pr-4 py-3
                             text-white placeholder:text-white/30
                             focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                             transition-colors"
                />
              </div>

              {/* サジェストドロップダウン */}
              {showSuggestions && filteredWorks.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto
                                bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl">
                  {filteredWorks.slice(0, 10).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setKeyword(w.title);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 flex items-center justify-between
                                 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {w.title}
                        </p>
                        <p className="text-[11px] text-white/30 truncate">
                          {w.title_en} / {w.genre} / {w.year}
                        </p>
                      </div>
                      <span className="shrink-0 ml-2 text-[10px] text-red-400 font-bold">
                        選択
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 作品の確認ステータス */}
              {keyword.trim() && !showSuggestions && (
                <div className="mt-2">
                  {exactMatch ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</span>
                      <span className="text-xs text-emerald-400 font-medium">
                        「{exactMatch.title}」（{exactMatch.genre} / {exactMatch.year}年）
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-yellow-500/80 flex items-center justify-center text-black text-[10px] font-bold">!</span>
                      <span className="text-xs text-yellow-400/80">
                        データベース未登録の作品です（AIが自動で聖地を検索します）
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </FormSection>

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
