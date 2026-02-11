"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Work = {
  title: string;
  title_en: string;
  year: number;
  genre: string;
};

export default function WorkSearch({ works }: { works: Work[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? works.filter(
        (w) =>
          w.title.includes(query) ||
          w.title_en.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // 外側クリックで閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectWork(title: string) {
    setQuery(title);
    setOpen(false);
    router.push(
      `/plan?theme=pilgrimage&work=${encodeURIComponent(title)}`
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {/* 検索アイコン */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="作品名を入力...（例: 君の名は、ゆるキャン）"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-warm-200 bg-white
                     text-navy placeholder:text-navy/30
                     focus:outline-none focus:border-sub focus:ring-2 focus:ring-sub/20
                     text-base transition-colors"
        />
      </div>

      {/* サジェストドロップダウン */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-warm-200 shadow-xl overflow-hidden">
          {filtered.map((w) => (
            <li key={w.title}>
              <button
                onClick={() => selectWork(w.title)}
                className="w-full px-5 py-3.5 text-left hover:bg-warm-100 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-navy font-medium">{w.title}</span>
                  <span className="text-navy/40 text-sm ml-2">
                    {w.title_en}
                  </span>
                </div>
                <span className="text-xs text-navy/30 shrink-0">
                  {w.year} / {w.genre}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-warm-200 shadow-xl p-5 text-center text-navy/40 text-sm">
          該当する作品が見つかりません
        </div>
      )}
    </div>
  );
}
