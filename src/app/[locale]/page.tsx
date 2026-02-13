import MangaTopPage from "@/components/MangaTopPage";
import { getAllWorks } from "@/lib/works-data";

// 人気Top10（ポスター付きカード表示）
const FEATURED_TITLES = new Set([
  "進撃の巨人",
  "鬼滅の刃",
  "呪術廻戦",
  "SPY×FAMILY",
  "葬送のフリーレン",
  "ONE PIECE",
  "NARUTO",
  "推しの子",
  "チェンソーマン",
  "君の名は。",
]);

const allWorks = getAllWorks().map((w) => ({
  slug: w.slug,
  title: w.title,
  title_en: w.title_en,
  year: w.year,
  genre: w.genre,
  spotCount: w.spots.length,
}));

const posterWorks = allWorks.filter((w) => FEATURED_TITLES.has(w.title));
const titleOnlyWorks = allWorks.filter((w) => !FEATURED_TITLES.has(w.title));

export default function Home() {
  return (
    <MangaTopPage
      posterWorks={posterWorks}
      titleOnlyWorks={titleOnlyWorks}
    />
  );
}
