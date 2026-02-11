import MangaTopPage from "@/components/MangaTopPage";
import spotsData from "../../data/pilgrimage-spots.json";
import { WORK_VISUALS } from "@/lib/work-visuals";

const allWorks = spotsData.map((w) => ({
  title: w.work_title,
  title_en: w.work_title_en,
  year: w.work_year,
  genre: w.work_genre,
  spotCount: w.spots.length,
}));

const posterWorks = allWorks.filter((w) => w.title in WORK_VISUALS);
const titleOnlyWorks = allWorks.filter((w) => !(w.title in WORK_VISUALS));

export default function Home() {
  return (
    <MangaTopPage
      posterWorks={posterWorks}
      titleOnlyWorks={titleOnlyWorks}
    />
  );
}
