"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPro } = useAuth();

  // 管理画面では非表示
  if (pathname?.startsWith("/admin")) return null;

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "AnimeTrips",
        text: "AIがつくるアニメ聖地巡礼プラン",
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-2 border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {/* ホーム */}
        <button
          onClick={() => router.push("/")}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            pathname === "/" ? "text-red-400" : "text-white/40 hover:text-white/60"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">ホーム</span>
        </button>

        {/* 検索 */}
        <button
          onClick={() => router.push("/plan?theme=pilgrimage")}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            pathname === "/plan" ? "text-red-400" : "text-white/40 hover:text-white/60"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-[10px] font-bold">プラン作成</span>
        </button>

        {/* シェア */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-white/40 hover:text-white/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-[10px] font-bold">シェア</span>
        </button>

        {/* Pro */}
        <button
          onClick={() => {
            if (!isPro) router.push("/pricing");
          }}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            isPro
              ? "text-emerald-400/60 cursor-default"
              : pathname === "/pricing"
                ? "text-red-400"
                : "text-white/40 hover:text-white/60"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-[10px] font-bold">
            {isPro ? "Pro" : "Pro"}
          </span>
        </button>
      </div>
    </nav>
  );
}
