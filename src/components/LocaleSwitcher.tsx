"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  function handleSwitch(next: string) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          className={`px-1.5 py-0.5 text-[10px] font-black transition-colors border ${
            loc === locale
              ? "text-red-400 border-red-500/40 bg-red-500/10"
              : "text-white/30 border-white/10 hover:text-white/60 hover:border-white/20"
          }`}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
