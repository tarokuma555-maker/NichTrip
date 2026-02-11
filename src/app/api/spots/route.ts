import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const workId = request.nextUrl.searchParams.get('work_id');

    if (!workId) {
      return NextResponse.json(
        { error: 'work_id クエリパラメータは必須です。' },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from('pilgrimage_spots')
      .select('id, work_id, name, address, lat, lng, scene_description, episode, access_info, google_place_id, tags')
      .eq('work_id', workId)
      .order('name');

    if (error) {
      console.error('Failed to fetch spots:', error);
      return NextResponse.json(
        { error: 'スポットの取得に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('spots error:', error);
    return NextResponse.json(
      { error: 'スポットの取得に失敗しました。' },
      { status: 500 }
    );
  }
}
