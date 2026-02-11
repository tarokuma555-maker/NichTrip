"use client";

import { useState, useEffect, useRef } from "react";
import type { PlanRequest, GeneratedPlan } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import LoadingAnimation from "./LoadingAnimation";
import PlanTimeline from "./PlanTimeline";
import PaywallModal from "./PaywallModal";
import AuthModal from "./AuthModal";
import ProBanner from "./ProBanner";

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
  { label: "その他", value: -1 },
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
  const { isPro } = useAuth();

  const [departure, setDeparture] = useState("東京");
  const [days, setDays] = useState<number | null>(null);
  const [daysCustom, setDaysCustom] = useState("");
  const [budget, setBudget] = useState<PlanRequest["budget"] | null>(null);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [companions, setCompanions] = useState<PlanRequest["companions"] | null>(null);
  const [companionsAdults, setCompanionsAdults] = useState(1);
  const [companionsChildren, setCompanionsChildren] = useState(0);
  const [keyword, setKeyword] = useState(work ?? "");

  // Pro: 複数作品選択
  const [selectedWorks, setSelectedWorks] = useState<WorkItem[]>(
    work ? [] : []
  );

  const [phase, setPhase] = useState<Phase>("form");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Paywall / Auth modals
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"usage_limit" | "multi_work">("usage_limit");
  const [showAuth, setShowAuth] = useState(false);

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

  // 実際に送信する日数
  const effectiveDays =
    days === -1 ? (parseInt(daysCustom) > 0 ? parseInt(daysCustom) : null) : days;

  const isBudgetReady =
    budget !== null &&
    (budget !== "custom" ||
      (parseInt(budgetMin) > 0 && parseInt(budgetMax) > 0));

  const isCompanionsReady =
    companions !== null &&
    (companions !== "custom" || companionsAdults > 0);

  // 作品が選択されているか
  const hasWork =
    (isPro && selectedWorks.length > 0) || keyword.trim() !== "";

  const isReady =
    hasWork &&
    departure.trim() !== "" &&
    effectiveDays !== null &&
    effectiveDays > 0 &&
    isBudgetReady &&
    isCompanionsReady;

  // サジェストから作品を選択
  function handleSelectWork(w: WorkItem) {
    if (isPro && !work) {
      // Pro: 複数作品モード
      if (selectedWorks.some((sw) => sw.id === w.id)) return;
      if (selectedWorks.length >= 3) return;
      setSelectedWorks((prev) => [...prev, w]);
      setKeyword("");
      setShowSuggestions(false);
    } else {
      // Free: 単一作品
      setKeyword(w.title);
      setShowSuggestions(false);
    }
  }

  // 選択済み作品を除去
  function handleRemoveWork(id: string) {
    setSelectedWorks((prev) => prev.filter((w) => w.id !== id));
  }

  async function handleSubmit() {
    if (!isReady) return;

    setPhase("loading");
    setErrorMsg("");

    try {
      const effectiveKeyword =
        isPro && selectedWorks.length > 0
          ? selectedWorks[0].title
          : keyword.trim();

      const body: PlanRequest = {
        theme,
        keyword: effectiveKeyword,
        ...(isPro && selectedWorks.length > 1 && {
          keywords: selectedWorks.map((w) => w.title),
        }),
        departure: departure.trim(),
        days: effectiveDays!,
        budget: budget!,
        ...(budget === "custom" && {
          budgetMin: parseInt(budgetMin),
          budgetMax: parseInt(budgetMax),
        }),
        companions: companions!,
        ...(companions === "custom" && {
          companionsAdults,
          companionsChildren,
        }),
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

      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        if (data?.code === "USAGE_LIMIT_EXCEEDED") {
          setPaywallReason("usage_limit");
          setShowPaywall(true);
          setPhase("form");
          return;
        }
        if (data?.code === "PRO_REQUIRED") {
          setPaywallReason("multi_work");
          setShowPaywall(true);
          setPhase("form");
          return;
        }
        setErrorMsg(data?.error ?? "プランの生成に失敗しました。");
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
    return (
      <PlanTimeline
        plan={plan}
        keyword={keyword}
        onReset={handleReset}
        departure={departure}
        budget={budget ?? undefined}
        companions={companions ?? undefined}
      />
    );
  }

  // ---------- Form / Error ----------
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        {/* 作品名（検索付き） */}
        <FormSection label="作品名" icon="🎬">
          {work ? (
            <div className="manga-input px-4 py-3 text-white font-bold">
              {work}
            </div>
          ) : (
            <div ref={suggestRef} className="relative">
              {/* Pro: 選択済み作品チップ */}
              {isPro && selectedWorks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedWorks.map((w) => (
                    <span
                      key={w.id}
                      className="inline-flex items-center gap-1.5 bg-red-500/10 border-2 border-red-500/30 text-white text-xs font-black px-2.5 py-1"
                    >
                      {w.title}
                      <button
                        type="button"
                        onClick={() => handleRemoveWork(w.id)}
                        className="text-red-400 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedWorks.length >= 3 && (
                    <span className="text-[10px] text-white/30 font-bold self-center">
                      最大3作品
                    </span>
                  )}
                </div>
              )}

              {/* 検索入力 */}
              {(!isPro || selectedWorks.length < 3) && (
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
                    placeholder={
                      isPro && selectedWorks.length > 0
                        ? "さらに作品を追加..."
                        : "作品名を検索..."
                    }
                    className="manga-input w-full pl-10 pr-4 py-3"
                  />
                </div>
              )}

              {/* Pro 誘導バナー */}
              {!isPro && !work && (
                <ProBanner
                  variant="inline"
                  message="複数の作品をミックスしてプランを作りたい場合はプロプランに登録できます"
                />
              )}

              {/* サジェストドロップダウン */}
              {showSuggestions && keyword.trim() && filteredWorks.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto
                                bg-[#111] border-2 border-white/20 shadow-[4px_4px_0_rgba(229,62,62,0.3)]">
                  {filteredWorks.slice(0, 10).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectWork(w)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between
                                 hover:bg-red-500/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-white font-bold truncate">
                          {w.title}
                        </p>
                        <p className="text-[11px] text-white/30 truncate">
                          {w.title_en} / {w.genre} / {w.year}
                        </p>
                      </div>
                      <span className="shrink-0 ml-2 text-[10px] text-red-400 font-black border border-red-500/30 px-2 py-0.5">
                        選択
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 作品の確認ステータス（単一作品モード時のみ） */}
              {!isPro && keyword.trim() && !showSuggestions && (
                <div className="mt-2">
                  {exactMatch ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">✓</span>
                      <span className="text-xs text-emerald-400 font-bold">
                        「{exactMatch.title}」（{exactMatch.genre} / {exactMatch.year}年）
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-yellow-500/80 flex items-center justify-center text-black text-[10px] font-black">!</span>
                      <span className="text-xs text-yellow-400/80">
                        データベース未登録（AIが自動で聖地を検索します）
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Pro: 選択済み作品がある場合のステータス */}
              {isPro && selectedWorks.length > 0 && !showSuggestions && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">✓</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    {selectedWorks.length}作品選択済み
                    {selectedWorks.length > 1 && " — ミックス巡礼プランを生成します"}
                  </span>
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* 出発地 */}
        <FormSection label="出発地" icon="📍">
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="東京"
            className="manga-input w-full px-4 py-3"
          />
        </FormSection>

        {/* 日数 */}
        <FormSection label="日数" icon="📅">
          <ChipGroup
            options={DAYS_OPTIONS.map((o) => ({
              key: String(o.value),
              label: o.label,
            }))}
            selected={days !== null ? String(days) : null}
            onSelect={(key) => setDays(Number(key))}
          />
          {days === -1 && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="365"
                value={daysCustom}
                onChange={(e) => setDaysCustom(e.target.value)}
                placeholder="日数"
                className="manga-input w-24 px-3 py-2.5 text-center"
              />
              <span className="text-sm text-white/50 font-bold">日間</span>
            </div>
          )}
        </FormSection>

        {/* 予算 */}
        <FormSection label="予算" icon="💰">
          <ChipGroup
            options={[
              ...BUDGET_OPTIONS.map((o) => ({
                key: o.value,
                label: o.label,
              })),
              { key: "custom", label: "手動で設定" },
            ]}
            selected={budget}
            onSelect={(key) => setBudget(key as PlanRequest["budget"])}
          />
          {budget === "custom" && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="下限"
                className="manga-input w-24 px-3 py-2.5 text-center"
              />
              <span className="text-sm text-white/40 font-black">〜</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="上限"
                className="manga-input w-24 px-3 py-2.5 text-center"
              />
              <span className="text-sm text-white/50 font-bold">円</span>
            </div>
          )}
        </FormSection>

        {/* 同行者 */}
        <FormSection label="同行者" icon="👥">
          <ChipGroup
            options={[
              ...COMPANIONS_OPTIONS.map((o) => ({
                key: o.value,
                label: `${o.emoji} ${o.label}`,
              })),
              { key: "custom", label: "人数を設定" },
            ]}
            selected={companions}
            onSelect={(key) =>
              setCompanions(key as PlanRequest["companions"])
            }
          />
          {companions === "custom" && (
            <div className="mt-3 flex flex-col gap-3">
              <CounterRow
                label="大人"
                value={companionsAdults}
                min={1}
                onChange={setCompanionsAdults}
              />
              <CounterRow
                label="子供"
                value={companionsChildren}
                min={0}
                onChange={setCompanionsChildren}
              />
            </div>
          )}
        </FormSection>
      </div>

      {/* エラーメッセージ */}
      {phase === "error" && errorMsg && (
        <div className="mt-6 bg-red-500/10 border-2 border-red-500/30 px-4 py-3 text-sm text-red-400 font-bold">
          {errorMsg}
        </div>
      )}

      {/* 送信ボタン */}
      <button
        onClick={handleSubmit}
        disabled={!isReady}
        className={`
          mt-8 w-full py-4 text-base font-black tracking-wider transition-all duration-200
          border-2
          ${
            isReady
              ? "bg-red-500 text-white border-red-400/50 shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
              : "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
          }
        `}
      >
        プランを作成する
      </button>

      {!isReady && (
        <p className="mt-2 text-center text-xs text-white/30 font-bold">
          すべての項目を入力すると生成できます
        </p>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          reason={paywallReason}
          onClose={() => setShowPaywall(false)}
          onLogin={() => {
            setShowPaywall(false);
            setShowAuth(true);
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          defaultTab="signup"
        />
      )}
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function FormSection({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-black text-white mb-2 tracking-wide">
        <span className="text-base">{icon}</span>
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
              px-4 py-2.5 text-sm font-bold transition-all duration-150 border-2
              ${
                active
                  ? "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
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

function CounterRow({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70 w-12 shrink-0 font-bold">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          -
        </button>
        <span className="w-8 text-center text-white font-black">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          +
        </button>
        <span className="text-sm text-white/40 font-bold">人</span>
      </div>
    </div>
  );
}
