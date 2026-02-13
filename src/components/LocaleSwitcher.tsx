"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_FLAGS: Record<string, string> = {
  ja: "🇯🇵",
  en: "🇺🇸",
  zh: "🇨🇳",
  ko: "🇰🇷",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSwitch(next: string) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative ml-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 text-[11px] font-black text-white/50
                   border border-white/10 hover:text-white/80 hover:border-white/30 transition-colors
                   whitespace-nowrap shrink-0"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span>{t(locale)}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[100px] bg-[#111] border-2 border-white/20
                        shadow-[4px_4px_0_rgba(0,0,0,0.4)] z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSwitch(loc)}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors flex items-center gap-2 ${
                loc === locale
                  ? "text-red-400 bg-red-500/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{LOCALE_FLAGS[loc]}</span>
              <span>{t(loc)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
