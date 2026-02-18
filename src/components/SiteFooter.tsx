"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const t = useTranslations("Blog");

  // 管理画面では非表示
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href="/blog"
            className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
          >
            {t("blogLabel")}
          </Link>
          <span className="text-[10px] text-white/10">|</span>
          <Link
            href="/legal/tokushoho"
            className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
          >
            特定商取引法に基づく表記
          </Link>
        </div>
        <p className="text-[9px] text-white/15 font-bold tracking-[0.15em]">
          &copy; 2025 AnimeTrips
        </p>
      </div>
    </footer>
  );
}
