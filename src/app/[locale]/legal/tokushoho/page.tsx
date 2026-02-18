import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const EMAIL = "tokyo.trips.anime1993@gmail.com";
const SITE_URL = "https://anime-trips.com";

type Row =
  | { label: string; value: string; type?: undefined }
  | { label: string; type: "email"; value: string }
  | { label: string; type: "link"; value: string }
  | { label: string; type: "custom" };

const ROWS: Row[] = [
  { label: "販売事業者", value: "大熊太郎" },
  { label: "運営責任者", value: "大熊太郎" },
  {
    label: "所在地",
    value: "〒104-0052 東京都中央区月島3-16-9-302 リノスタイル月島 302",
  },
  {
    label: "電話番号",
    value: "請求があった場合は遅滞なく開示いたします",
  },
  { label: "メールアドレス", type: "email", value: EMAIL },
  { label: "販売URL", type: "link", value: SITE_URL },
  {
    label: "販売価格",
    value:
      "AnimeTrips Pro プラン：月額480円（税込）※4ヶ月目以降は月額980円（税込）。詳細は各プランページに記載しています。",
  },
  {
    label: "商品代金以外の必要料金",
    value:
      "なし（追加手数料、送料等は発生しません。ただし、サービスのご利用に必要なインターネット接続料金・通信料金はお客様のご負担となります。）",
  },
  {
    label: "支払方法",
    value:
      "クレジットカード（Visa、Mastercard、JCB、American Express）、Apple Pay",
  },
  {
    label: "支払時期",
    value:
      "クレジットカード決済およびApple Payは購入手続き完了時に即時決済されます。月額プランの場合、毎月の更新日に自動決済されます。",
  },
  {
    label: "サービス提供時期",
    value: "決済完了後、直ちにサービスをご利用いただけます。",
  },
  { label: "返品・キャンセルについて", type: "custom" },
  {
    label: "動作環境",
    value:
      "最新版のウェブブラウザ（Google Chrome、Safari、Firefox、Microsoft Edge）。スマートフォン・タブレット・PCに対応。インターネット接続が必要です。",
  },
];

function RowCell({ row }: { row: Row }) {
  if (row.type === "email") {
    return (
      <a href={`mailto:${row.value}`} className="text-red-400 hover:underline">
        {row.value}
      </a>
    );
  }
  if (row.type === "link") {
    return (
      <a
        href={row.value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-400 hover:underline break-all"
      >
        {row.value}
      </a>
    );
  }
  if (row.type === "custom") {
    return (
      <div className="space-y-3">
        <div>
          <p className="font-bold text-white/70 mb-1">
            ＜お客様都合による解約・返品＞
          </p>
          <p>
            月額プランはいつでも解約が可能です。解約した場合、現在の請求期間の終了まではサービスをご利用いただけます。日割り返金は行っておりません。
          </p>
        </div>
        <div>
          <p className="font-bold text-white/70 mb-1">
            ＜サービスの不具合による返金＞
          </p>
          <p>
            サービスに重大な不具合が発生し、正常にご利用いただけない場合は、メール（
            <a
              href={`mailto:${EMAIL}`}
              className="text-red-400 hover:underline"
            >
              {EMAIL}
            </a>
            ）にてお問い合わせください。状況を確認の上、返金対応いたします。
          </p>
        </div>
      </div>
    );
  }
  return <>{row.value}</>;
}

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
            <div key={row.label} className="flex flex-col sm:flex-row">
              <div className="sm:w-48 shrink-0 bg-white/5 px-4 py-3 text-xs font-bold text-white/60">
                {row.label}
              </div>
              <div className="px-4 py-3 text-xs text-white/80 leading-relaxed">
                <RowCell row={row} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
