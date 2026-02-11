import MangaTopPage from "@/components/MangaTopPage";
import spotsData from "../../data/pilgrimage-spots.json";

const works = spotsData.map((w) => ({
  title: w.work_title,
  title_en: w.work_title_en,
  year: w.work_year,
  genre: w.work_genre,
  spotCount: w.spots.length,
}));

export default function Home() {
  return <MangaTopPage works={works} />;
}
