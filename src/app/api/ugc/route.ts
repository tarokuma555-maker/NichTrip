import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { isProUser } from '@/lib/subscription';

const FREE_REVIEW_LIMIT = 5;

export async function GET(request: NextRequest) {
  try {
    const spotName = request.nextUrl.searchParams.get('spotName');
    const workTitle = request.nextUrl.searchParams.get('workTitle') ?? '';

    if (!spotName) {
      return NextResponse.json(
        { error: 'spotName は必須です' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // チェックイン数
    const { count: checkinCount } = await supabase
      .from('spot_checkins')
      .select('id', { count: 'exact', head: true })
      .eq('spot_name', spotName)
      .eq('work_title', workTitle);

    // ユーザー自身のチェックイン有無
    let userCheckedIn = false;
    if (user) {
      const { count } = await supabase
        .from('spot_checkins')
        .select('id', { count: 'exact', head: true })
        .eq('spot_name', spotName)
        .eq('work_title', workTitle)
        .eq('user_id', user.id);
      userCheckedIn = (count ?? 0) > 0;
    }

    // レビュー総数
    const { count: totalReviewCount } = await supabase
      .from('spot_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('spot_name', spotName)
      .eq('work_title', workTitle);

    // レビュー一覧（Free=5件, Pro=全件）
    const pro = user ? await isProUser(user.id, user?.email) : false;
    const limit = pro ? 100 : FREE_REVIEW_LIMIT;

    const { data: reviews } = await supabase
      .from('spot_reviews')
      .select('*')
      .eq('spot_name', spotName)
      .eq('work_title', workTitle)
      .order('created_at', { ascending: false })
      .limit(limit);

    return NextResponse.json({
      checkinCount: checkinCount ?? 0,
      userCheckedIn,
      reviews: reviews ?? [],
      totalReviewCount: totalReviewCount ?? 0,
    });
  } catch (error) {
    console.error('ugc GET error:', error);
    return NextResponse.json({
      checkinCount: 0,
      userCheckedIn: false,
      reviews: [],
      totalReviewCount: 0,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'checkin') {
      const { spotName, workTitle, lat, lng } = body;

      if (!spotName) {
        return NextResponse.json(
          { error: 'spotName は必須です' },
          { status: 400 }
        );
      }

      const { error } = await supabase.from('spot_checkins').upsert(
        {
          user_id: user.id,
          spot_name: spotName,
          work_title: workTitle ?? '',
          lat: lat ?? null,
          lng: lng ?? null,
        },
        { onConflict: 'user_id,spot_name,work_title' }
      );

      if (error) {
        console.error('checkin error:', error);
        return NextResponse.json(
          { error: 'チェックインに失敗しました' },
          { status: 500 }
        );
      }

      const { count } = await supabase
        .from('spot_checkins')
        .select('id', { count: 'exact', head: true })
        .eq('spot_name', spotName)
        .eq('work_title', workTitle ?? '');

      return NextResponse.json({
        success: true,
        totalCheckins: count ?? 1,
      });
    }

    if (action === 'review') {
      const {
        spotName,
        workTitle,
        rating,
        comment,
        photoUrl,
        tips,
        bestAngle,
        visitedDate,
      } = body;

      if (!spotName || !rating || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'spotName と rating (1-5) は必須です' },
          { status: 400 }
        );
      }

      const { error } = await supabase.from('spot_reviews').insert({
        user_id: user.id,
        spot_name: spotName,
        work_title: workTitle ?? '',
        rating,
        comment: comment || null,
        photo_url: photoUrl || null,
        tips: tips || null,
        best_angle: bestAngle || null,
        visited_date: visitedDate || null,
      });

      if (error) {
        console.error('review error:', error);
        return NextResponse.json(
          { error: 'レビューの投稿に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: '不正な action です' },
      { status: 400 }
    );
  } catch (error) {
    console.error('ugc POST error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
