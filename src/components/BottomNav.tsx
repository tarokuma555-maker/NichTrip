"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getRandomHotelAffiliates } from "@/lib/a8-affiliates";
import { CategoryIcon } from "@/components/ads/CategoryIcons";

/* eslint-disable @next/next/no-img-element */

const DISMISS_KEY = "animetrips_nav_ad_dismissed";

function NavAdBar() {
  const { isPro } = useAuth();
  const [dismissed, setDismissed] = useState(true);
  const affiliates = useMemo(() => getRandomHotelAffiliates(4), []);

  useEffect(() => {
    const ts = sessionStorage.getItem(DISMISS_KEY);
    if (ts && Date.now() - parseInt(ts, 10) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, []);

  if (isPro || dismissed || affiliates.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border-t border-red-500/15 h-[38px] overflow-hidden flex items-center">
      <div className="nav-ad-scroll flex items-center gap-6 whitespace-nowrap pl-4">
        {[...affiliates, ...affiliates].map((af, i) => (
          <a
            key={`${af.id}-${i}`}
            href={af.linkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-red-400/70 transition-colors shrink-0"
          >
            <CategoryIcon category={af.category} className="w-3.5 h-3.5 opacity-50" />
            <span className="font-bold">{af.name}</span>
            <span className="text-white/20">●</span>
          </a>
        ))}
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem(DISMISS_KEY, String(Date.now()));
        }}
        className="absolute right-1 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 text-xs px-1 z-10 bg-[#0a0a0a]/80"
        aria-label="close"
      >
        &times;
      </button>
      {affiliates.map((af) => (
        <img
          key={`imp-${af.id}`}
          src={af.impTagUrl}
          width={1}
          height={1}
          alt=""
          loading="lazy"
          aria-hidden="true"
          style={{ border: "none", position: "absolute", visibility: "hidden" }}
        />
      ))}
      <style jsx>{`
        .nav-ad-scroll {
          animation: navAdScroll 30s linear infinite;
        }
        @keyframes navAdScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPro } = useAuth();
  const t = useTranslations("BottomNav");

  // 管理画面では非表示
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-2 border-white/10 pb-[env(safe-area-inset-bottom)]">
      <NavAdBar />
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
          <span className="text-[10px] font-bold">{t("home")}</span>
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
          <span className="text-[10px] font-bold">{t("plan")}</span>
        </button>

        {/* チャット */}
        <button
          onClick={() => router.push("/chat")}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            pathname === "/chat" ? "text-red-400" : "text-white/40 hover:text-white/60"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[10px] font-bold">{t("chat")}</span>
        </button>

        {/* みんなの巡礼 */}
        <button
          onClick={() => router.push("/feed")}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            pathname === "/feed" ? "text-red-400" : "text-white/40 hover:text-white/60"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold">{t("report")}</span>
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
            {t("pro")}
          </span>
        </button>
      </div>
    </nav>
  );
}
