import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ROWS = [
  { label: "販売事業者", value: "個人事業主" },
  { label: "運営責任者", value: "奥間太郎" },
  { label: "所在地", value: "沖縄県中頭郡北谷町北谷2-16-2-805" },
  {
    label: "連絡先",
    // TODO: 独自ドメインメール取得後に差し替え
    value: "support@animetrips.jp",
    isEmail: true,
  },
  { label: "販売価格", value: "各プラン詳細ページに記載" },
  {
    label: "支払方法",
    value: "クレジットカード（Stripe経由）",
  },
  { label: "支払時期", value: "購入手続き完了時に即時決済" },
  { label: "商品の引渡し時期", value: "決済完了後、即時にサービスをご利用いただけます" },
  {
    label: "返品・キャンセル",
    value:
      "デジタルコンテンツの性質上、購入後の返品・返金は原則としてお受けしておりません。ただし、サービスに重大な不具合がある場合は個別にご対応いたします。",
  },
  {
    label: "動作環境",
    value:
      "最新版の Chrome / Safari / Firefox / Edge。インターネット接続が必要です。",
  },
] as const;

export default function TokushohoPage() {
  const t = useTranslations("Common");
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ヘッダー */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">{t("backToTop")}</span>
          </Link>
          <span className="ml-auto text-base font-black text-white">
            {t("animeTrips")}
          </span>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24">
        <h1 className="text-lg sm:text-xl font-black text-white mb-8">
          特定商取引法に基づく表記
        </h1>

        <div className="border border-white/10 divide-y divide-white/10">
          {ROWS.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row"
            >
              <div className="sm:w-44 shrink-0 bg-white/5 px-4 py-3 text-xs font-bold text-white/60">
                {row.label}
              </div>
              <div className="px-4 py-3 text-xs text-white/80 leading-relaxed">
                {"isEmail" in row && row.isEmail ? (
                  <a
                    href={`mailto:${row.value}`}
                    className="text-red-400 hover:underline"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
