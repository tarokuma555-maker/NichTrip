"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function UsageBadge({ className = "" }: { className?: string }) {
  const { user, isPro, loading: authLoading } = useAuth();
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState<number | null>(3);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => {
        setUsed(data.used ?? 0);
        setLimit(data.limit ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [authLoading, user]);

  if (authLoading || !loaded) return null;

  if (isPro) {
    return (
      <span
        className={`inline-flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-black px-2 py-0.5 ${className}`}
      >
        💎 Pro
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
