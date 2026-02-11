"use client";

export default function MangaDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 集中線クラスター（右上） */}
      <svg
        className="absolute top-24 right-6 w-20 h-14 text-navy/[0.04] -rotate-12"
        viewBox="0 0 80 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <line x1="0" y1="0" x2="80" y2="56" />
        <line x1="0" y1="8" x2="80" y2="48" />
        <line x1="0" y1="16" x2="80" y2="40" />
        <line x1="0" y1="24" x2="80" y2="32" />
      </svg>

      {/* 擬音「ドドド」（左下） */}
      <span className="absolute bottom-40 left-4 text-5xl font-black text-navy/[0.03] -rotate-6 select-none tracking-wider">
        ドドド
      </span>

      {/* スターバースト（右中央） */}
      <svg
        className="absolute top-1/3 right-10 w-10 h-10 text-accent/[0.05]"
        viewBox="0 0 40 40"
      >
        <polygon
          points="20,0 24,14 40,14 28,22 32,38 20,28 8,38 12,22 0,14 16,14"
          fill="currentColor"
        />
      </svg>

      {/* コマ枠コーナー（左上） */}
      <svg
        className="absolute top-44 left-3 w-8 h-8 text-navy/[0.05]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M0,12 L0,0 L12,0" />
      </svg>

      {/* コマ枠コーナー（右下） */}
      <svg
        className="absolute bottom-60 right-4 w-8 h-8 text-navy/[0.05]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M32,20 L32,32 L20,32" />
      </svg>

      {/* 擬音「ゴゴゴ」（右寄り中段） */}
      <span className="absolute top-[55%] right-6 text-4xl font-black text-navy/[0.025] rotate-3 select-none tracking-widest">
        ゴゴゴ
      </span>

      {/* 集中線クラスター（左中段） */}
      <svg
        className="absolute top-[45%] left-2 w-16 h-12 text-navy/[0.035] rotate-6"
        viewBox="0 0 64 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <line x1="0" y1="48" x2="64" y2="0" />
        <line x1="0" y1="40" x2="64" y2="8" />
        <line x1="0" y1="32" x2="64" y2="16" />
      </svg>

      {/* 「キラ」スパークル（左下寄り） */}
      <svg
        className="absolute bottom-28 left-1/4 w-6 h-6 text-accent/[0.06]"
        viewBox="0 0 24 24"
      >
        <path
          d="M12,0 L14,10 L24,12 L14,14 L12,24 L10,14 L0,12 L10,10 Z"
          fill="currentColor"
        />
      </svg>

      {/* ハーフトーンパッチ */}
      <div className="absolute top-[70%] left-6 w-28 h-28 rounded-full manga-halftone opacity-[0.025]" />

      {/* 小さいスパークル（上部中央寄り） */}
      <svg
        className="absolute top-32 left-1/3 w-4 h-4 text-sub/[0.06]"
        viewBox="0 0 16 16"
      >
        <path
          d="M8,0 L9.5,6.5 L16,8 L9.5,9.5 L8,16 L6.5,9.5 L0,8 L6.5,6.5 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
