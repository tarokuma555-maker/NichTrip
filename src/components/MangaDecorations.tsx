"use client";

export default function MangaDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 集中線クラスター（右上） */}
      <svg
        className="absolute top-20 right-5 w-28 h-20 text-navy/[0.06] -rotate-12"
        viewBox="0 0 112 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <line x1="0" y1="0" x2="112" y2="80" />
        <line x1="0" y1="12" x2="112" y2="68" />
        <line x1="0" y1="24" x2="112" y2="56" />
        <line x1="0" y1="36" x2="112" y2="44" />
        <line x1="0" y1="48" x2="112" y2="32" />
      </svg>

      {/* 擬音「ドドド」（左下） */}
      <span className="absolute bottom-36 left-3 text-6xl font-black text-navy/[0.05] -rotate-6 select-none tracking-wider">
        ドドド
      </span>

      {/* スターバースト（右中央） */}
      <svg
        className="absolute top-1/3 right-8 w-14 h-14 text-accent/[0.08]"
        viewBox="0 0 56 56"
      >
        <polygon
          points="28,0 33,20 56,20 38,32 44,56 28,40 12,56 18,32 0,20 23,20"
          fill="currentColor"
        />
      </svg>

      {/* コマ枠コーナー（左上） */}
      <svg
        className="absolute top-40 left-3 w-10 h-10 text-navy/[0.07]"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M0,16 L0,0 L16,0" />
      </svg>

      {/* コマ枠コーナー（右下） */}
      <svg
        className="absolute bottom-52 right-3 w-10 h-10 text-navy/[0.07]"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M40,24 L40,40 L24,40" />
      </svg>

      {/* 擬音「ゴゴゴ」（右寄り中段） */}
      <span className="absolute top-[55%] right-4 text-5xl font-black text-navy/[0.04] rotate-3 select-none tracking-widest">
        ゴゴゴ
      </span>

      {/* 集中線クラスター（左中段） */}
      <svg
        className="absolute top-[42%] left-1 w-24 h-16 text-navy/[0.05] rotate-6"
        viewBox="0 0 96 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <line x1="0" y1="64" x2="96" y2="0" />
        <line x1="0" y1="52" x2="96" y2="12" />
        <line x1="0" y1="40" x2="96" y2="24" />
      </svg>

      {/* 「キラ」スパークル（左下寄り） */}
      <svg
        className="absolute bottom-24 left-1/4 w-8 h-8 text-accent/[0.08]"
        viewBox="0 0 32 32"
      >
        <path
          d="M16,0 L19,13 L32,16 L19,19 L16,32 L13,19 L0,16 L13,13 Z"
          fill="currentColor"
        />
      </svg>

      {/* ハーフトーンパッチ */}
      <div className="absolute top-[68%] left-5 w-36 h-36 rounded-full manga-halftone opacity-[0.04]" />

      {/* 小さいスパークル（上部中央寄り） */}
      <svg
        className="absolute top-28 left-1/3 w-5 h-5 text-sub/[0.08]"
        viewBox="0 0 20 20"
      >
        <path
          d="M10,0 L12,8 L20,10 L12,12 L10,20 L8,12 L0,10 L8,8 Z"
          fill="currentColor"
        />
      </svg>

      {/* 「バーン！」エフェクト（中央右寄り下部） */}
      <span className="absolute bottom-[18%] right-12 text-3xl font-black text-accent/[0.04] -rotate-3 select-none">
        バーン！
      </span>

      {/* 吹き出し形状（左上寄り） */}
      <svg
        className="absolute top-[25%] left-8 w-16 h-12 text-navy/[0.04]"
        viewBox="0 0 64 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4,4 L60,4 Q60,4 60,4 L60,32 L40,32 L32,44 L28,32 L4,32 Z" strokeLinejoin="round" />
      </svg>

      {/* 追加のスパークル（右上寄り） */}
      <svg
        className="absolute top-[15%] right-1/4 w-6 h-6 text-accent/[0.06] animate-manga-float"
        viewBox="0 0 24 24"
      >
        <path
          d="M12,0 L14,10 L24,12 L14,14 L12,24 L10,14 L0,12 L10,10 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
