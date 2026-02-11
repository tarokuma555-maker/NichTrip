import ThemeSelector from "@/components/ThemeSelector";
import WorkSearch from "@/components/WorkSearch";
import PopularWorks from "@/components/PopularWorks";
import MangaDecorations from "@/components/MangaDecorations";
import spotsData from "../../data/pilgrimage-spots.json";

// JSON から作品情報を抽出（サーバー側で静的に処理）
const works = spotsData.map((w) => ({
  title: w.work_title,
  title_en: w.work_title_en,
  year: w.work_year,
  genre: w.work_genre,
  spotCount: w.spots.length,
}));

function SpeedLines() {
  const lines = Array.from({ length: 48 }, (_, i) => {
    const angle = (i * 7.5 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1="200"
        y1="200"
        x2={200 + 200 * Math.cos(angle)}
        y2={200 + 200 * Math.sin(angle)}
        stroke="#1A365D"
        strokeWidth={i % 4 === 0 ? 2.5 : i % 2 === 0 ? 1 : 0.4}
      />
    );
  });

  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.04]"
      viewBox="0 0 400 400"
    >
      {lines}
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="max-w-4xl mx-auto px-5 my-2">
      <div className="flex items-center gap-3 py-3">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
        <svg className="w-5 h-5 text-accent/20" viewBox="0 0 20 20">
          <path
            d="M10,0 L12.5,7.5 L20,10 L12.5,12.5 L10,20 L7.5,12.5 L0,10 L7.5,7.5 Z"
            fill="currentColor"
          />
        </svg>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
      </div>
    </div>
  );
}

function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="text-center mb-6">
      <div className="inline-block relative">
        {/* 左アクションライン */}
        <svg
          className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="0" y1="4" x2="18" y2="4" />
          <line x1="4" y1="12" x2="24" y2="12" />
          <line x1="0" y1="20" x2="18" y2="20" />
        </svg>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy px-4">
          {children}
        </h2>
        {/* 右アクションライン */}
        <svg
          className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="6" y1="4" x2="24" y2="4" />
          <line x1="0" y1="12" x2="20" y2="12" />
          <line x1="6" y1="20" x2="24" y2="20" />
        </svg>
      </div>
      {sub && (
        <p className="text-sm text-navy/50 mt-2">{sub}</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* 漫画風背景デコレーション */}
      <MangaDecorations />

      {/* ===== ヒーローセクション ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-50 to-white">
        {/* 装飾背景 */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute top-32 -left-20 w-72 h-72 rounded-full bg-sub/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-warm-300/30 blur-3xl" />
        </div>

        {/* ハーフトーンオーバーレイ */}
        <div className="absolute inset-0 manga-halftone opacity-[0.03]" />

        {/* 放射状集中線 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <SpeedLines />
        </div>

        {/* コマ枠コーナーブラケット */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-[3px] border-t-[3px] border-navy/15" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-[3px] border-t-[3px] border-navy/15" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-[3px] border-b-[3px] border-navy/15" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-[3px] border-b-[3px] border-navy/15" />

        <div className="relative max-w-4xl mx-auto px-5 pt-14 pb-18 sm:pt-24 sm:pb-28 text-center">
          {/* ロゴ（スターバースト付き） */}
          <div className="relative inline-block">
            <svg
              className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)] text-accent/[0.08] animate-manga-pulse"
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,2 60,35 95,35 66,57 78,90 50,70 22,90 34,57 5,35 40,35"
                fill="currentColor"
              />
            </svg>
            <h1 className="relative text-5xl sm:text-6xl font-extrabold tracking-tight text-navy mb-4">
              <span className="inline-block mr-2">🗺️</span>
              NichTrip
            </h1>
          </div>

          {/* キャッチコピー */}
          <p className="text-lg sm:text-xl text-navy/70 max-w-lg mx-auto leading-relaxed">
            テーマを選ぶだけで、
            <br className="sm:hidden" />
            AIがあなただけの
            <span className="manga-gradient-text font-extrabold">ニッチ旅</span>
            を作る
          </p>

          {/* サブテキスト */}
          <p className="mt-4 text-xs text-navy/40 tracking-wide">
            Anime Pilgrimage / Power Spot / Gourmet Tour
          </p>
        </div>
      </section>

      {/* ===== テーマ選択 ===== */}
      <section className="max-w-4xl mx-auto px-5 -mt-6 relative z-10">
        <ThemeSelector />
      </section>

      <SectionDivider />

      {/* ===== 作品検索 ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-6">
        <SectionHeading sub="聖地巡礼したいアニメ・映画のタイトルを入力">
          作品から探す
        </SectionHeading>
        <WorkSearch works={works} />
      </section>

      <SectionDivider />

      {/* ===== 人気作品カルーセル ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-6 mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
              対応作品
            </h2>
            <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {works.length} WORKS
            </span>
          </div>
          <span className="text-xs text-navy/40 font-medium">
            {works.reduce((s, w) => s + w.spotCount, 0)} スポット収録
          </span>
        </div>
        <PopularWorks works={works} />
      </section>

      {/* ===== フッター ===== */}
      <footer className="relative border-t-2 border-navy/10 py-8 text-center">
        <p className="text-sm text-navy/40">
          &copy; 2025 NichTrip &mdash; AIがつくるニッチな旅
        </p>
      </footer>
    </div>
  );
}
