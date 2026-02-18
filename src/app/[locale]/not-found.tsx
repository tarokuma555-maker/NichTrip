import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* グリッド背景 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229,62,62,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 赤グロー */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-500/8 blur-[120px]" />

      {/* コマ枠 */}
      <div className="absolute inset-4 sm:inset-8 border border-white/5 pointer-events-none" />
      <div className="absolute inset-4 sm:inset-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-l-[3px] border-t-[3px] border-red-500/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-[3px] border-t-[3px] border-red-500/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-[3px] border-b-[3px] border-red-500/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-[3px] border-b-[3px] border-red-500/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* 404 大文字 */}
        <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter">
          <span className="text-white manga-shadow-red">4</span>
          <span className="text-red-500 manga-shadow">0</span>
          <span className="text-white manga-shadow-red">4</span>
        </h1>

        {/* テキスト */}
        <p className="text-[10px] font-black tracking-[0.4em] text-red-500/60 uppercase mt-2 mb-4">
          Page Not Found
        </p>
        <p className="text-sm text-white/40 leading-relaxed mb-8">
          お探しのページは見つかりませんでした。<br />
          URLを確認するか、トップページからお探しください。
        </p>

        {/* ホームへ戻る */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-black
                     px-8 py-3.5 border-2 border-red-400/30
                     shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)]
                     hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
