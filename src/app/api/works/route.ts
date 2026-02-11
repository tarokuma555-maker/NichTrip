import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('anime_works')
      .select('id, title, title_en, genre, year, image_url, description')
      .order('year', { ascending: false });

    if (error) {
      console.error('Failed to fetch works:', error);
      return NextResponse.json(
        { error: '作品一覧の取得に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('works error:', error);
    return NextResponse.json(
      { error: '作品一覧の取得に失敗しました。' },
      { status: 500 }
    );
  }
}
