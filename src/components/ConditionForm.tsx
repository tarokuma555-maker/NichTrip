"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { PlanRequest, GeneratedPlan } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import LoadingAnimation from "./LoadingAnimation";
import PlanTimeline from "./PlanTimeline";
import PaywallModal from "./PaywallModal";
import AuthModal from "./AuthModal";
import ProBanner from "./ProBanner";

type Phase = "form" | "loading" | "result" | "error";
type Tab = "new" | "history";

type HistoryEntry = {
  id: string;
  keyword: string;
  departure: string;
  days: number;
  createdAt: string;
  plan: GeneratedPlan;
};

const SESSION_KEY = "animetrips_plan_state";
const USAGE_KEY = "animetrips_usage";
const HISTORY_KEY = "animetrips_plan_history";
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveToHistory(entry: HistoryEntry): void {
  try {
    const history = loadHistory();
    // Avoid duplicate
    const filtered = history.filter((h) => h.id !== entry.id);
    filtered.unshift(entry);
    // Keep max entries
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
  } catch {}
}

function getLocalUsage(): { month: string; count: number } {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.month === currentMonth) {
        return { month: currentMonth, count: data.count ?? 0 };
      }
    }
    return { month: currentMonth, count: 0 };
  } catch {
    return { month: "", count: 0 };
  }
}

function incrementLocalUsage(): void {
  try {
    const usage = getLocalUsage();
    localStorage.setItem(
      USAGE_KEY,
      JSON.stringify({ month: usage.month, count: usage.count + 1 })
    );
  } catch {}
}

type WorkItem = {
  id: string;
  title: string;
  title_en: string;
  genre: string;
  year: number;
};

const DAYS_OPTIONS: { labelKey: string; value: number }[] = [
  { labelKey: "dayTrip", value: 1 },
  { labelKey: "oneNight", value: 2 },
  { labelKey: "twoNights", value: 3 },
  { labelKey: "other", value: -1 },
];

const BUDGET_OPTIONS: { labelKey: string; value: PlanRequest["budget"] }[] = [
  { labelKey: "budgetLow", value: "low" },
  { labelKey: "budgetMedium", value: "medium" },
  { labelKey: "budgetHigh", value: "high" },
];

const COMPANIONS_OPTIONS: {
  labelKey: string;
  emoji: string;
  value: PlanRequest["companions"];
}[] = [
  { labelKey: "solo", emoji: "🧑", value: "solo" },
  { labelKey: "couple", emoji: "💑", value: "couple" },
  { labelKey: "friends", emoji: "👫", value: "friends" },
  { labelKey: "family", emoji: "👨‍👩‍👧", value: "family" },
];

export default function ConditionForm({
  theme,
  work,
}: {
  theme: PlanRequest["theme"];
  work?: string;
}) {
  const { isPro } = useAuth();
  const locale = useLocale();
  const t = useTranslations("ConditionForm");

  const [tab, setTab] = useState<Tab>("new");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyPlan, setHistoryPlan] = useState<HistoryEntry | null>(null);

  const [departure, setDeparture] = useState("東京");
  const [days, setDays] = useState<number | null>(-1);
  const [daysCustom, setDaysCustom] = useState("2");
  const [budget, setBudget] = useState<PlanRequest["budget"] | null>("custom");
  const [budgetMin, setBudgetMin] = useState("10000");
  const [budgetMax, setBudgetMax] = useState("50000");
  const [companions, setCompanions] = useState<PlanRequest["companions"] | null>("custom");
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

  // Usage tracking (localStorage as primary, API as secondary)
  const [usageUsed, setUsageUsed] = useState(() => getLocalUsage().count);
  const [usageLimit, setUsageLimit] = useState(3);

  // Paywall / Auth modals
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"usage_limit" | "multi_work">("usage_limit");
  const [showAuth, setShowAuth] = useState(false);

  // 作品検索用
  const [allWorks, setAllWorks] = useState<WorkItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  // 履歴を読み込み
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // sessionStorageから復元
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.plan && s.phase === "result") {
          setPlan(s.plan);
          setPhase("result");
          setKeyword(s.keyword ?? work ?? "");
          setDeparture(s.departure ?? "東京");
          setDays(s.days ?? null);
          setBudget(s.budget ?? null);
          setCompanions(s.companions ?? null);
        }
      }
    } catch {}
  }, [work]);

  // プラン結果をsessionStorageに保存
  const savePlanToSession = useCallback(
    (planData: GeneratedPlan) => {
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            phase: "result",
            plan: planData,
            keyword,
            departure,
            days,
            budget,
            companions,
          })
        );
      } catch {}
    },
    [keyword, departure, days, budget, companions]
  );

  // 使用量を取得（localStorage優先、API結果と大きい方を採用）
  const fetchUsage = useCallback(() => {
    const localUsage = getLocalUsage();
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        const serverUsed = typeof data.used === "number" ? data.used : 0;
        // サーバーとローカルの大きい方を採用（どちらかが正しい値を持っている）
        const actualUsed = Math.max(serverUsed, localUsage.count);
        setUsageUsed(actualUsed);
        if (typeof data.limit === "number") setUsageLimit(data.limit);
        // ローカルを同期
        if (actualUsed > localUsage.count) {
          try {
            localStorage.setItem(
              USAGE_KEY,
              JSON.stringify({ month: localUsage.month, count: actualUsed })
            );
          } catch {}
        }
      })
      .catch(() => {
        // API失敗時はlocalStorageの値を使用
        setUsageUsed(localUsage.count);
      });
  }, []);

  useEffect(() => {
    if (!isPro) fetchUsage();
  }, [isPro, fetchUsage]);

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

  const usageLimitReached = !isPro && usageUsed >= usageLimit;

  const isReady =
    hasWork &&
    departure.trim() !== "" &&
    effectiveDays !== null &&
    effectiveDays > 0 &&
    isBudgetReady &&
    isCompanionsReady &&
    !usageLimitReached;

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
        body: JSON.stringify({ ...body, locale }),
      });

      if (res.status === 429) {
        setErrorMsg(t("rateLimitError"));
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
        setErrorMsg(data?.error ?? t("generateError"));
        setPhase("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error ?? t("generateError"));
        setPhase("error");
        return;
      }

      const data: GeneratedPlan = await res.json();
      setPlan(data);
      setPhase("result");
      savePlanToSession(data);
      incrementLocalUsage();
      setUsageUsed((prev) => prev + 1);
      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(36),
        keyword: isPro && selectedWorks.length > 0
          ? selectedWorks.map((w) => w.title).join(" × ")
          : keyword.trim(),
        departure: departure.trim(),
        days: effectiveDays!,
        createdAt: new Date().toISOString(),
        plan: data,
      };
      saveToHistory(entry);
      setHistory(loadHistory());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg(t("networkError"));
      setPhase("error");
    }
  }

  function handleReset() {
    setPlan(null);
    setPhase("form");
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
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

  // ---------- History view ----------
  if (historyPlan) {
    return (
      <PlanTimeline
        plan={historyPlan.plan}
        keyword={historyPlan.keyword}
        onReset={() => {
          setHistoryPlan(null);
          setTab("history");
        }}
        departure={historyPlan.departure}
      />
    );
  }

  // ---------- Form / Error ----------
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab switcher */}
      <div className="flex gap-0 mb-6 border-2 border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setTab("new")}
          className={`flex-1 py-2.5 text-sm font-black transition-colors ${
            tab === "new"
              ? "bg-red-500 text-white"
              : "bg-white/5 text-white/40 hover:text-white/60"
          }`}
        >
          {t("newPlan")}
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={`flex-1 py-2.5 text-sm font-black transition-colors relative ${
            tab === "history"
              ? "bg-red-500 text-white"
              : "bg-white/5 text-white/40 hover:text-white/60"
          }`}
        >
          {t("history")}
          {history.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black bg-white/10 border border-white/20">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* History tab */}
      {tab === "history" && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-white/30 font-bold">{t("noHistory")}</p>
              <button
                type="button"
                onClick={() => setTab("new")}
                className="mt-4 text-xs text-red-400 font-black border-2 border-red-500/30 px-4 py-2 hover:bg-red-500/10 transition-colors"
              >
                {t("createPlan")}
              </button>
            </div>
          ) : (
            history.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setHistoryPlan(entry);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full text-left bg-white/5 border-2 border-white/10 p-4 hover:border-white/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-black text-white truncate">
                    {entry.plan.title}
                  </span>
                  <span className="text-[10px] text-white/30 font-bold shrink-0">
                    {new Date(entry.createdAt).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/40 font-bold">
                  <span>{entry.keyword}</span>
                  <span>|</span>
                  <span>{entry.departure}{t("departure")}</span>
                  <span>|</span>
                  <span>{entry.days === 1 ? t("dayTrip") : t("nightStay", { nights: entry.days - 1, days: entry.days })}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* New plan form */}
      {tab === "new" && (
      <>
      <div className="space-y-6">
        {/* 作品名（検索付き） */}
        <FormSection label={t("workLabel")} icon="🎬">
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
                      {t("max3works")}
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
                        ? t("addMore")
                        : t("searchWork")
                    }
                    className="manga-input w-full pl-10 pr-4 py-3"
                  />
                </div>
              )}

              {/* Pro 誘導バナー */}
              {!isPro && !work && (
                <ProBanner
                  variant="inline"
                  message={t("proMixBanner")}
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
                        {t("select")}
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
                        {t("notInDB")}
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
                    {t("worksSelected", { count: selectedWorks.length })}
                    {selectedWorks.length > 1 && t("mixPlan")}
                  </span>
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* 出発地 */}
        <FormSection label={t("departureLabel")} icon="📍">
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder={t("departurePlaceholder")}
            className="manga-input w-full px-4 py-3"
          />
        </FormSection>

        {/* 日数 */}
        <FormSection label={t("daysLabel")} icon="📅">
          <ChipGroup
            options={DAYS_OPTIONS.map((o) => ({
              key: String(o.value),
              label: t(o.labelKey),
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
                placeholder={t("daysPlaceholder")}
                className="manga-input w-24 px-3 py-2.5 text-center"
              />
              <span className="text-sm text-white/50 font-bold">{t("daysUnit")}</span>
            </div>
          )}
        </FormSection>

        {/* 予算 */}
        <FormSection label={t("budgetLabel")} icon="💰">
          <ChipGroup
            options={[
              ...BUDGET_OPTIONS.map((o) => ({
                key: o.value,
                label: t(o.labelKey),
              })),
              { key: "custom", label: t("budgetCustom") },
            ]}
            selected={budget}
            onSelect={(key) => setBudget(key as PlanRequest["budget"])}
          />
          {budget === "custom" && (
            <BudgetSlider
              min={budgetMin}
              max={budgetMax}
              onMinChange={setBudgetMin}
              onMaxChange={setBudgetMax}
            />
          )}
        </FormSection>

        {/* 同行者 */}
        <FormSection label={t("companionsLabel")} icon="👥">
          <ChipGroup
            options={[
              ...COMPANIONS_OPTIONS.map((o) => ({
                key: o.value,
                label: `${o.emoji} ${t(o.labelKey)}`,
              })),
              { key: "custom", label: t("customCount") },
            ]}
            selected={companions}
            onSelect={(key) =>
              setCompanions(key as PlanRequest["companions"])
            }
          />
          {companions === "custom" && (
            <div className="mt-3 flex flex-col gap-3">
              <CounterRow
                label={t("adults")}
                value={companionsAdults}
                min={1}
                onChange={setCompanionsAdults}
              />
              <CounterRow
                label={t("children")}
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

      {/* 残り回数 */}
      {!isPro && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs text-white/40 font-bold">{t("remainingCount")}</span>
          <div className="flex gap-1">
            {Array.from({ length: usageLimit }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 border ${
                  i < usageLimit - usageUsed
                    ? "bg-red-500 border-red-400/50"
                    : "bg-white/5 border-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-red-400">
            {Math.max(0, usageLimit - usageUsed)}/{usageLimit}
          </span>
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
        {t("generatePlan")}
      </button>

      {usageLimitReached ? (
        <div className="mt-4 text-center space-y-3">
          <p className="text-xs text-red-400 font-black">
            {t("limitReached")}
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 bg-red-500 text-white text-sm font-black px-6 py-3 border-2 border-red-400/50
                       shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)] hover:translate-x-0.5 hover:translate-y-0.5
                       transition-all duration-200"
          >
            {t("registerProPlan")}
            <span className="text-xs">&rarr;</span>
          </a>
          <p className="text-[11px] text-white/30">
            {t("proUnlimited")}
          </p>
        </div>
      ) : !isReady ? (
        <p className="mt-2 text-center text-xs text-white/30 font-bold">
          {t("fillAll")}
        </p>
      ) : null}
      </>
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
  const t = useTranslations("ConditionForm");
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
        <span className="text-sm text-white/40 font-bold">{t("personUnit")}</span>
      </div>
    </div>
  );
}

const BUDGET_STEP = 5000;
const BUDGET_MIN_LIMIT = 5000;
const BUDGET_MAX_LIMIT = 300000;

function BudgetSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  const t = useTranslations("ConditionForm");
  const minVal = parseInt(min) || 10000;
  const maxVal = parseInt(max) || 50000;

  // 初期値セット
  useEffect(() => {
    if (!min) onMinChange("10000");
    if (!max) onMaxChange("50000");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stepMin(delta: number) {
    const next = Math.min(
      Math.max(BUDGET_MIN_LIMIT, minVal + delta * BUDGET_STEP),
      maxVal - BUDGET_STEP
    );
    onMinChange(String(next));
  }

  function stepMax(delta: number) {
    const next = Math.min(
      BUDGET_MAX_LIMIT,
      Math.max(minVal + BUDGET_STEP, maxVal + delta * BUDGET_STEP)
    );
    onMaxChange(String(next));
  }

  const barLeft = ((minVal - BUDGET_MIN_LIMIT) / (BUDGET_MAX_LIMIT - BUDGET_MIN_LIMIT)) * 100;
  const barRight = ((BUDGET_MAX_LIMIT - maxVal) / (BUDGET_MAX_LIMIT - BUDGET_MIN_LIMIT)) * 100;

  function formatYen(v: number) {
    if (v >= 10000) {
      const man = v / 10000;
      return t("currencyManYen", { amount: Number.isInteger(man) ? String(man) : man.toFixed(1) });
    }
    return t("currencyYen", { amount: v.toLocaleString() });
  }

  return (
    <div className="mt-3 space-y-3">
      {/* 下限 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50 w-8 shrink-0 font-bold">{t("budgetMin")}</span>
        <button
          type="button"
          onClick={() => stepMin(-1)}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          -
        </button>
        <span className="flex-1 text-center text-sm text-white font-black">
          {formatYen(minVal)}
        </span>
        <button
          type="button"
          onClick={() => stepMin(1)}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          +
        </button>
      </div>

      {/* ビジュアルバー */}
      <div className="relative h-2 bg-white/5 border border-white/10">
        <div
          className="absolute top-0 bottom-0 bg-red-500/60"
          style={{ left: `${barLeft}%`, right: `${barRight}%` }}
        />
      </div>

      {/* 上限 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50 w-8 shrink-0 font-bold">{t("budgetMax")}</span>
        <button
          type="button"
          onClick={() => stepMax(-1)}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          -
        </button>
        <span className="flex-1 text-center text-sm text-white font-black">
          {formatYen(maxVal)}
        </span>
        <button
          type="button"
          onClick={() => stepMax(1)}
          className="w-8 h-8 bg-white/5 border-2 border-white/10 text-white/70
                     hover:border-white/30 flex items-center justify-center text-lg font-black"
        >
          +
        </button>
      </div>

      {/* ラベル */}
      <div className="flex justify-between text-[10px] text-white/30 font-bold">
        <span>{formatYen(BUDGET_MIN_LIMIT)}</span>
        <span>{formatYen(BUDGET_MAX_LIMIT)}</span>
      </div>
    </div>
  );
}
