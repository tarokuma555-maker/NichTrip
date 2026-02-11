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
  const lines = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 10 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1="200"
        y1="200"
        x2={200 + 200 * Math.cos(angle)}
        y2={200 + 200 * Math.sin(angle)}
        stroke="#1A365D"
        strokeWidth={i % 3 === 0 ? 2 : 0.5}
      />
    );
  });

  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
      viewBox="0 0 400 400"
    >
      {lines}
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="max-w-4xl mx-auto px-5">
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-navy/10" />
        <svg className="w-4 h-4 text-navy/15" viewBox="0 0 16 16">
          <path
            d="M8,0 L10,6 L16,8 L10,10 L8,16 L6,10 L0,8 L6,6 Z"
            fill="currentColor"
          />
        </svg>
        <div className="flex-1 h-px bg-navy/10" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* 漫画風背景デコレーション */}
      <MangaDecorations />

      {/* ===== ヒーローセクション ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-100 via-warm-50 to-white">
        {/* 装飾背景 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-32 -left-20 w-72 h-72 rounded-full bg-sub/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-warm-300/20 blur-3xl" />
        </div>

        {/* ハーフトーンオーバーレイ */}
        <div className="absolute inset-0 manga-halftone opacity-[0.02]" />

        {/* 放射状集中線 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <SpeedLines />
        </div>

        {/* コマ枠コーナーブラケット */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-navy/10 rounded-tl-sm" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-navy/10 rounded-tr-sm" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-navy/10 rounded-bl-sm" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-navy/10 rounded-br-sm" />

        <div className="relative max-w-4xl mx-auto px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          {/* ロゴ（スターバースト付き） */}
          <div className="relative inline-block">
            <svg
              className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] text-accent/[0.07]"
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,5 58,35 90,35 64,55 74,85 50,67 26,85 36,55 10,35 42,35"
                fill="currentColor"
              />
            </svg>
            <h1 className="relative text-4xl sm:text-5xl font-extrabold tracking-tight text-navy mb-4">
              <span className="inline-block mr-2">🗺️</span>
              NichTrip AI
            </h1>
          </div>

          {/* キャッチコピー */}
          <p className="text-lg sm:text-xl text-navy/70 max-w-lg mx-auto leading-relaxed">
            テーマを選ぶだけで、
            <br className="sm:hidden" />
            AIがあなただけの
            <span className="text-accent font-bold">ニッチ旅</span>
            を作る
          </p>
        </div>
      </section>

      {/* ===== テーマ選択 ===== */}
      <section className="max-w-4xl mx-auto px-5 -mt-6 relative z-10">
        <ThemeSelector />
      </section>

      <SectionDivider />

      {/* ===== 作品検索 ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-8">
        <h2 className="text-xl font-bold text-navy text-center mb-2">
          作品から探す
        </h2>
        <p className="text-sm text-navy/50 text-center mb-6">
          聖地巡礼したいアニメ・映画のタイトルを入力
        </p>
        <WorkSearch works={works} />
      </section>

      <SectionDivider />

      {/* ===== 人気作品カルーセル ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-8 mb-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-navy">対応作品</h2>
          <span className="text-sm text-navy/40">
            全{works.length}作品 /{" "}
            {works.reduce((s, w) => s + w.spotCount, 0)}スポット
          </span>
        </div>
        <PopularWorks works={works} />
      </section>

      {/* ===== フッター ===== */}
      <footer className="relative border-t border-warm-200 py-8 text-center text-sm text-navy/40">
        <p>&copy; 2025 NichTrip AI &mdash; AIがつくるニッチな旅</p>
      </footer>
    </div>
  );
}
