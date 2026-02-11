import { NextResponse } from 'next/server';
import spotsData from '../../../../data/pilgrimage-spots.json';

export const dynamic = 'force-static';

export async function GET() {
  // pilgrimage-spots.json から作品一覧を生成
  const works = spotsData.map((w) => ({
    id: w.work_title_en.toLowerCase().replace(/\s+/g, '-'),
    title: w.work_title,
    title_en: w.work_title_en,
    genre: w.work_genre,
    year: w.work_year,
  }));

  return NextResponse.json(works);
}
