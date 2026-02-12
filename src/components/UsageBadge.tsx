"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const USAGE_KEY = "animetrips_usage";

function getLocalUsage(): number {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.month === currentMonth) return data.count ?? 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

export default function UsageBadge({ className = "" }: { className?: string }) {
  const { user, isPro, loading: authLoading } = useAuth();
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState<number | null>(3);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    // まずlocalStorageから取得
    const localUsed = getLocalUsage();
    setUsed(localUsed);

    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => {
        const serverUsed = data.used ?? 0;
        // サーバーとローカルの大きい方を採用
        setUsed(Math.max(serverUsed, localUsed));
        setLimit(data.limit ?? 3);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [authLoading, user]);

  // localStorageの変更を監視（他コンポーネントからの更新）
  useEffect(() => {
    function handleStorage() {
      setUsed(getLocalUsage());
    }
    window.addEventListener("storage", handleStorage);
    // 定期的にチェック（同一タブ内の変更はstorageイベントが発火しない）
    const interval = setInterval(() => {
      const current = getLocalUsage();
      setUsed((prev) => Math.max(prev, current));
    }, 2000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (authLoading || (!loaded && used === 0)) return null;

  if (isPro) {
    return (
      <span
        className={`inline-flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-black px-2 py-0.5 ${className}`}
      >
        Pro
      </span>
    );
  }

  if (limit === null) return null;

  const remaining = Math.max(0, limit - used);
  const colorClass =
    remaining === 0
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : remaining === 1
        ? "text-orange-400 border-orange-500/30 bg-orange-500/10"
        : "text-white/50 border-white/10 bg-white/5";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 border ${colorClass} ${className}`}
    >
      残り{remaining}回
    </span>
  );
}
