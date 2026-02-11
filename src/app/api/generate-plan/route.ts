import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '@/lib/supabase';
import type { PlanRequest, GeneratedPlan, PilgrimageSpot } from '@/lib/types';

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

const BUDGET_LABEL: Record<string, string> = {
  low: '節約（1日5,000円以内）',
  medium: '標準（1日10,000〜15,000円）',
  high: 'リッチ（1日30,000円以上OK）',
};

const COMPANIONS_LABEL: Record<string, string> = {
  solo: 'ひとり旅',
  couple: 'カップル',
  friends: '友達グループ',
  family: 'ファミリー',
};

function getBudgetLabel(req: PlanRequest): string {
  if (req.budget === 'custom' && req.budgetMin != null && req.budgetMax != null) {
    return `総額 ${req.budgetMin.toLocaleString()}円〜${req.budgetMax.toLocaleString()}円`;
  }
  return BUDGET_LABEL[req.budget] ?? '指定なし';
}

function getCompanionsLabel(req: PlanRequest): string {
  if (req.companions === 'custom') {
    const adults = req.companionsAdults ?? 1;
    const children = req.companionsChildren ?? 0;
    const parts: string[] = [];
    if (adults > 0) parts.push(`大人${adults}人`);
    if (children > 0) parts.push(`子供${children}人`);
    return parts.join('・') || '大人1人';
  }
  return COMPANIONS_LABEL[req.companions] ?? '指定なし';
}

const THEME_LABEL: Record<PlanRequest['theme'], string> = {
  pilgrimage: 'アニメ聖地巡礼',
  powerspot: 'パワースポット巡り',
  gourmet: 'ご当地グルメ旅',
};

function buildPrompt(
  req: PlanRequest,
  spots: PilgrimageSpot[],
  workTitle: string
): string {
  const spotsInfo = spots
    .map(
      (s) =>
        `- ${s.name}（${s.address}）\n` +
        `  緯度経度: ${s.lat}, ${s.lng}\n` +
        `  シーン: ${s.scene_description}\n` +
        `  話数: ${s.episode}\n` +
        `  アクセス: ${s.access_info}`
    )
    .join('\n');

  return `あなたは日本のアニメ聖地巡礼・ニッチ旅行の専門プランナーです。
以下の条件で旅行プランをJSON形式で生成してください。

## 条件
- テーマ: ${THEME_LABEL[req.theme]}
- キーワード/作品: ${req.keyword}
- 出発地: ${req.departure}
- 日数: ${req.days}日間
- 予算: ${getBudgetLabel(req)}
- 同行者: ${getCompanionsLabel(req)}

## 参考：聖地スポットデータ（${workTitle}）
${spotsInfo || '該当する登録スポットなし（あなたの知識で補完してください）'}

## 出力JSON形式（厳密に従ってください）
{
  "title": "プランのタイトル",
  "summary": "プランの概要（2〜3文）",
  "days": [
    {
      "day": 1,
      "title": "1日目のタイトル",
      "spots": [
        {
          "name": "スポット名",
          "address": "住所",
          "lat": 35.0000,
          "lng": 139.0000,
          "anime_scene": "関連するアニメシーンの説明（あれば）",
          "episode": "関連する話数（あれば）",
          "stay_minutes": 60,
          "access": "前のスポットからのアクセス方法",
          "tips": "訪問時のアドバイス",
          "nearby_food": {
            "name": "近くのおすすめ飲食店",
            "genre": "ジャンル",
            "budget": "予算目安"
          }
        }
      ]
    }
  ],
  "total_budget_estimate": "旅行全体の予算目安",
  "best_season": "おすすめの季節"
}

## ルール
- 1日あたり3〜5スポットを含めてください
- 移動の効率を考慮してスポットを並べてください
- 聖地スポットデータがある場合は必ず組み込み、さらに周辺の関連スポットも追加してください
- 緯度経度は実在する正確な値を使用してください
- nearby_foodは実在する可能性の高い店舗・ジャンルを記載してください
- JSONのみを出力し、前後に説明文やマークダウンのコードブロックを付けないでください`;
}

function parseGeneratedPlan(text: string): GeneratedPlan {
  // コードブロックで囲まれている場合を除去
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned) as GeneratedPlan;
}

async function callClaude(prompt: string, maxRetries = 2): Promise<GeneratedPlan> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== 'text') {
      lastError = new Error('Unexpected response type from Claude API');
      continue;
    }

    try {
      return parseGeneratedPlan(block.text);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      // 最終リトライでなければ続行
      if (attempt < maxRetries) continue;
    }
  }

  throw lastError ?? new Error('Failed to generate plan');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PlanRequest;

    // --- バリデーション ---
    if (!body.keyword || !body.days || !body.theme) {
      return NextResponse.json(
        { error: 'keyword, days, theme は必須です' },
        { status: 400 }
      );
    }

    // --- Supabaseから聖地データを取得 ---
    const supabase = getSupabase();

    // キーワードに一致する作品を検索
    const { data: works } = await supabase
      .from('anime_works')
      .select('id, title')
      .or(`title.ilike.%${body.keyword}%,title_en.ilike.%${body.keyword}%`);

    let spots: PilgrimageSpot[] = [];
    let workTitle = body.keyword;

    if (works && works.length > 0) {
      workTitle = works[0].title;
      const workIds = works.map((w) => w.id);

      const { data: spotData } = await supabase
        .from('pilgrimage_spots')
        .select('*')
        .in('work_id', workIds);

      if (spotData) {
        spots = spotData as PilgrimageSpot[];
      }
    }

    // --- Claude APIでプラン生成 ---
    const prompt = buildPrompt(body, spots, workTitle);
    const plan = await callClaude(prompt);

    // --- 生成結果をSupabaseに保存 ---
    const { error: insertError } = await supabase
      .from('generated_plans')
      .insert({
        theme: body.theme,
        keyword: body.keyword,
        departure: body.departure || '',
        days: body.days,
        budget: body.budget,
        companions: body.companions,
        plan_title: plan.title,
        plan_summary: plan.summary,
        plan_data: plan.days,
        total_budget_estimate: plan.total_budget_estimate,
        best_season: plan.best_season,
      });

    if (insertError) {
      console.error('Failed to save plan:', insertError);
      // 保存失敗でもプラン自体は返す
    }

    return NextResponse.json(plan);
  } catch (error) {
    // レート制限エラー
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'APIのレート制限に達しました。しばらく待ってから再度お試しください。' },
        { status: 429 }
      );
    }

    console.error('generate-plan error:', error);
    return NextResponse.json(
      { error: '旅行プランの生成に失敗しました。' },
      { status: 500 }
    );
  }
}
