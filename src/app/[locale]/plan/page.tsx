import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import PlanPageContent from "./PlanPageContent";
import PlanPageHeader from "./PlanPageHeader";

export default function PlanPage() {
  const t = useTranslations("Common");
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ヘッダー */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-5 h-14 flex items-center flex-nowrap min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{t("backToTop")}</span>
          </Link>
          <span className="ml-auto text-base font-black text-white">
            {t("animeTrips")}
          </span>
          <PlanPageHeader />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 sm:px-5 py-8 pb-20">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
            </div>
          }
        >
          <PlanPageContent />
        </Suspense>
      </main>
    </div>
  );
}
