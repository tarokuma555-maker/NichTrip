import ThemeSelector from "@/components/ThemeSelector";
import WorkSearch from "@/components/WorkSearch";
import PopularWorks from "@/components/PopularWorks";
import spotsData from "../../data/pilgrimage-spots.json";

// JSON から作品情報を抽出（サーバー側で静的に処理）
const works = spotsData.map((w) => ({
  title: w.work_title,
  title_en: w.work_title_en,
  year: w.work_year,
  genre: w.work_genre,
  spotCount: w.spots.length,
}));

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===== ヒーローセクション ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-100 via-warm-50 to-white">
        {/* 装飾背景 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-32 -left-20 w-72 h-72 rounded-full bg-sub/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-warm-300/20 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          {/* ロゴ */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy mb-4">
            <span className="inline-block mr-2">🗺️</span>
            NichTrip AI
          </h1>

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

      {/* ===== 作品検索 ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-14">
        <h2 className="text-xl font-bold text-navy text-center mb-2">
          作品から探す
        </h2>
        <p className="text-sm text-navy/50 text-center mb-6">
          聖地巡礼したいアニメ・映画のタイトルを入力
        </p>
        <WorkSearch works={works} />
      </section>

      {/* ===== 人気作品カルーセル ===== */}
      <section className="max-w-4xl mx-auto px-5 mt-16 mb-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-navy">
            対応作品
          </h2>
          <span className="text-sm text-navy/40">
            全{works.length}作品 / {works.reduce((s, w) => s + w.spotCount, 0)}スポット
          </span>
        </div>
        <PopularWorks works={works} />
      </section>

      {/* ===== フッター ===== */}
      <footer className="border-t border-warm-200 py-8 text-center text-sm text-navy/40">
        <p>&copy; 2025 NichTrip AI &mdash; AIがつくるニッチな旅</p>
      </footer>
    </div>
  );
}
