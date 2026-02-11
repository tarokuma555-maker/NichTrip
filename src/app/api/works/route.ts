import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import spotsData from '../../../../data/pilgrimage-spots.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. JSONファイルからの作品リスト（既存データ）
  const jsonWorks = spotsData.map((w) => ({
    id: w.work_title_en.toLowerCase().replace(/\s+/g, '-'),
    title: w.work_title,
    title_en: w.work_title_en,
    genre: w.work_genre,
    year: w.work_year,
  }));

  // 2. Supabase anime_works から追加作品（承認済み分）
  const jsonTitles = new Set(jsonWorks.map((w) => w.title));
  let extraWorks: typeof jsonWorks = [];

  try {
    const { data: dbWorks } = await getSupabase()
      .from('anime_works')
      .select('id, title, title_en, genre, year')
      .order('year', { ascending: false });

    extraWorks = (dbWorks ?? [])
      .filter((w) => !jsonTitles.has(w.title))
      .map((w) => ({
        id: w.id,
        title: w.title,
        title_en: w.title_en,
        genre: w.genre,
        year: w.year,
      }));
  } catch {
    // DB未接続時はJSONのみで動作
  }

  return NextResponse.json([...jsonWorks, ...extraWorks]);
}
