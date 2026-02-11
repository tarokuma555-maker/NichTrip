"use client";

import { useState, useEffect } from "react";
import type { TransportOption } from "@/lib/types";

export default function TransportOptions({
  from,
  to,
  companions,
}: {
  from: string;
  to: string;
  companions?: string;
}) {
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!from || !to) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({ from, to });
    if (companions) params.set("companions", companions);

    fetch(`/api/affiliate/transport?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setOptions(data.options ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [from, to, companions]);

  if (error || (!loading && options.length === 0)) return null;

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <span>🚃</span>
          おすすめの行き方
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 border-2 border-white/10 p-4 animate-pulse"
            >
              <div className="h-5 w-40 bg-white/10 mb-3" />
              <div className="h-4 w-24 bg-white/10 mb-2" />
              <div className="h-3 w-56 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <span>🚃</span>
        おすすめの行き方
      </h3>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="bg-white/5 border-2 border-white/10 p-4 relative overflow-hidden"
          >
            {/* おすすめバッジ */}
            {idx === 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2.5 py-1">
                おすすめ
              </span>
            )}

            {/* ヘッダー: アイコン + 名前 + 所要時間 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{opt.icon}</span>
              <span className="text-sm font-black text-white">{opt.name}</span>
              <span className="text-xs text-white/40 ml-auto shrink-0">
                {opt.duration}
              </span>
            </div>

            {/* 料金 + 乗り換え */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-base font-black text-red-400">
                {opt.price}
              </span>
              {opt.transfers > 0 && (
                <span className="text-[11px] text-white/40 font-bold">
                  乗り換え{opt.transfers}回
                </span>
              )}
              {opt.transfers === 0 && (
                <span className="text-[11px] text-emerald-400/60 font-bold">
                  直通
                </span>
              )}
            </div>

            {/* おすすめポイント */}
            <p className="text-xs text-white/50 mb-3 leading-relaxed">
              {opt.recommendation}
            </p>

            {/* CTA */}
            {opt.type === "taxi" ? (
              <p className="text-[11px] text-white/30 font-bold">
                GOアプリやDiDiで配車できます
              </p>
            ) : opt.bookingUrl ? (
              <a
                href={opt.bookingUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-xs font-black text-red-400 border-2 border-red-500/30 px-3 py-1.5
                           hover:bg-red-500/10 transition-colors"
              >
                チケットを見る
                <span className="text-[10px]">&rarr;</span>
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
