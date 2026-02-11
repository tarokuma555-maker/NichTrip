import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import spotsData from '../../../../data/pilgrimage-spots.json';

/* eslint-disable @typescript-eslint/no-explicit-any */

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url === 'your_url_here') return null;
  return createClient(url, serviceKey || anonKey || '');
}

type RawWork = {
  title: string;
  title_en: string;
  genre: string;
  year: number;
  description: string;
  spots: RawSpot[];
};

type RawSpot = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  scene_description: string;
  episode: string;
  access_info: string;
};

function validateWork(w: any): w is RawWork {
  if (!w.title || typeof w.title !== 'string') return false;
  if (!Array.isArray(w.spots) || w.spots.length === 0) return false;

  w.spots = w.spots.filter((s: any) => {
    if (!s.name || !s.address) return false;
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    if (lat < 24 || lat > 46) return false;
    if (lng < 122 || lng > 146) return false;
    return true;
  });

  return w.spots.length > 0;
}

// ===== GET: Cron 実行 =====
export async function GET(request: NextRequest) {
  // CRON_SECRET 認証
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. 既存作品名を収集
    const jsonTitles = spotsData.map((w: any) => w.work_title as string);

    let dbTitles: string[] = [];
    try {
      const { data } = await getSupabase()
        .from('anime_works')
        .select('title')
        .order('year', { ascending: false })
        .limit(200);
      dbTitles = (data ?? []).map((r: any) => r.title);
    } catch {
      // DB未接続時は無視
    }

    const allTitles = Array.from(new Set([...jsonTitles, ...dbTitles]));
    const excludeList = allTitles.slice(0, 50).join('、');

    // 2. Claude API で新作品発掘
    const prompt = `2024年〜2025年に放送・公開された日本のアニメ作品で、実在の場所が舞台として使われている作品を5作品提案してください。

既にデータベースにある以下の作品は除外:
${excludeList}

各作品について以下のJSON形式で出力:
{
  "title": "作品名",
  "title_en": "英語名",
  "genre": "TVアニメ/映画/OVA",
  "year": 2024,
  "description": "あらすじ50文字以内",
  "spots": [
    {
      "name": "スポット名",
      "address": "都道府県から始まる正確な住所",
      "lat": 35.1234,
      "lng": 139.1234,
      "scene_description": "登場シーンの説明",
      "episode": "第X話 or 映画",
      "access_info": "最寄駅からのアクセス"
    }
  ]
}
JSON配列のみ出力。余計な説明やマークダウンは不要。`;

    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== 'text') {
      return NextResponse.json({ queued: 0, error: 'No text response' });
    }

    // 3. JSON パース
    const cleaned = block.text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const rawWorks: any[] = JSON.parse(cleaned);

    // 4. バリデーション + INSERT
    const validWorks = rawWorks.filter(validateWork);

    let queued = 0;
    for (const work of validWorks) {
      const { error } = await getSupabase()
        .from('auto_enrichment_queue')
        .insert({
          work_title: work.title,
          work_data: {
            title: work.title,
            title_en: work.title_en || '',
            genre: work.genre || 'TVアニメ',
            year: work.year || 2024,
            description: work.description || '',
          },
          spots_data: work.spots.map((s: RawSpot) => ({
            name: s.name,
            address: s.address,
            lat: Number(s.lat),
            lng: Number(s.lng),
            scene_description: s.scene_description || '',
            episode: s.episode || '',
            access_info: s.access_info || '',
          })),
          status: 'pending',
        });

      if (!error) queued++;
    }

    return NextResponse.json({
      queued,
      total_generated: rawWorks.length,
      valid: validWorks.length,
    });
  } catch (error) {
    console.error('auto-enrich GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===== POST: 管理画面から承認/却下 =====
export async function POST(request: NextRequest) {
  try {
    // 管理者認証
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!user || !adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, id } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'action と id は必須です' },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    if (action === 'reject') {
      await admin
        .from('auto_enrichment_queue')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', id);

      return NextResponse.json({ success: true });
    }

    if (action === 'approve') {
      // 1. キューからレコード取得
      const { data: queueItem } = await admin
        .from('auto_enrichment_queue')
        .select('*')
        .eq('id', id)
        .single();

      if (!queueItem) {
        return NextResponse.json(
          { error: 'Queue item not found' },
          { status: 404 }
        );
      }

      const workData = queueItem.work_data as any;
      const spotsArr = queueItem.spots_data as any[];

      // 2. ID生成（works/route.tsと同じロジック: スペースをハイフンに）
      const baseId = (workData.title_en || workData.title)
        .toLowerCase()
        .replace(/\s+/g, '-');
      let workId = baseId;

      // 重複チェック — 既存IDがあればサフィックス追加
      const { data: existing } = await admin
        .from('anime_works')
        .select('id')
        .eq('id', workId)
        .maybeSingle();

      if (existing) {
        workId = `${baseId}-${Date.now()}`;
      }

      // 3. anime_works に INSERT
      const { error: workError } = await admin.from('anime_works').insert({
        id: workId,
        title: workData.title,
        title_en: workData.title_en || '',
        genre: workData.genre || 'TVアニメ',
        year: workData.year || 2024,
        image_url: '',
        description: workData.description || '',
      });

      if (workError) {
        console.error('anime_works insert error:', workError);
        return NextResponse.json(
          { error: '作品データの登録に失敗しました' },
          { status: 500 }
        );
      }

      // 4. pilgrimage_spots に各スポットを INSERT
      const spotInserts = spotsArr.map((s: any) => ({
        work_id: workId,
        name: s.name,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        scene_description: s.scene_description || '',
        episode: s.episode || '',
        access_info: s.access_info || '',
        google_place_id: '',
        tags: [workData.genre || 'TVアニメ'],
      }));

      const { error: spotsError } = await admin.from('pilgrimage_spots').insert(spotInserts);

      if (spotsError) {
        console.error('pilgrimage_spots insert error:', spotsError);
        // 作品は登録済みなのでキューは承認扱いにする
      }

      // 5. キューのステータス更新
      await admin
        .from('auto_enrichment_queue')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', id);

      return NextResponse.json({ success: true, workId });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('auto-enrich POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
