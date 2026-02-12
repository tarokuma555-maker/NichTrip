import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '@/lib/supabase';
import { createSupabaseServer } from '@/lib/supabase-server';
import { isProUser } from '@/lib/subscription';
import { checkUsageLimit, recordUsage } from '@/lib/usage';
import type { PlanRequest, GeneratedPlan, PilgrimageSpot } from '@/lib/types';
import {
  parseLocale,
  getLanguageInstruction,
  getBudgetLabel,
  getCompanionsLabel,
  getCustomCompanionsLabel,
  getCustomBudgetLabel,
  getNoSpecLabel,
  type SupportedLocale,
} from '@/lib/api-i18n';

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

function getBudgetLabelForReq(req: PlanRequest, locale: SupportedLocale): string {
  if (req.budget === 'custom' && req.budgetMin != null && req.budgetMax != null) {
    return getCustomBudgetLabel(locale, req.budgetMin, req.budgetMax);
  }
  return getBudgetLabel(locale, req.budget) || getNoSpecLabel(locale);
}

function getCompanionsLabelForReq(req: PlanRequest, locale: SupportedLocale): string {
  if (req.companions === 'custom') {
    const adults = req.companionsAdults ?? 1;
    const children = req.companionsChildren ?? 0;
    return getCustomCompanionsLabel(locale, adults, children);
  }
  return getCompanionsLabel(locale, req.companions) || getNoSpecLabel(locale);
}

const THEME_LABEL: Record<PlanRequest['theme'], string> = {
  pilgrimage: 'アニメ聖地巡礼',
  powerspot: 'パワースポット巡り',
  gourmet: 'ご当地グルメ旅',
};

/** 単一作品のプロンプト */
function buildPrompt(
  req: PlanRequest,
  spots: PilgrimageSpot[],
  workTitle: string,
  locale: SupportedLocale
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
- 予算: ${getBudgetLabelForReq(req, locale)}
- 同行者: ${getCompanionsLabelForReq(req, locale)}

## 参考：聖地スポットデータ（${workTitle}）
${spotsInfo || '該当する登録スポットなし（あなたの知識で補完してください）'}

${JSON_FORMAT_SECTION}

${RULES_SECTION}${getLanguageInstruction(locale)}`;
}

/** 複数作品クロスオーバーのプロンプト */
function buildMultiWorkPrompt(
  req: PlanRequest,
  workSpotsMap: Map<string, PilgrimageSpot[]>,
  locale: SupportedLocale
): string {
  const workTitles = Array.from(workSpotsMap.keys());

  let spotsSection = '';
  workSpotsMap.forEach((spots, title) => {
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
    spotsSection += `\n### ${title}\n${spotsInfo || '登録スポットなし（自動で補完）'}\n`;
  });

  return `あなたは日本のアニメ聖地巡礼・ニッチ旅行の専門プランナーです。
以下の条件で【複数作品をまたぐ聖地巡礼プラン】をJSON形式で生成してください。

## 条件
- テーマ: ${THEME_LABEL[req.theme]}（クロスオーバー）
- 作品: ${workTitles.join(', ')}
- 出発地: ${req.departure}
- 日数: ${req.days}日間
- 予算: ${getBudgetLabelForReq(req, locale)}
- 同行者: ${getCompanionsLabelForReq(req, locale)}

## 参考：聖地スポットデータ
${spotsSection}

${JSON_FORMAT_SECTION}

## ルール（厳守）
- 【最重要】各作品から最低2つ以上の聖地スポットを必ず含めてください。3作品なら合計6スポット以上、2作品なら合計4スポット以上です
- 各作品のスポット数は可能な限り均等にしてください（例: 2作品なら各3スポット程度）
- 1日あたり3〜5スポットを含めてください
- 地理的な近さを重視し、異なる作品のスポットでも近ければ同じ日にまとめてください
- anime_sceneには必ず「【作品名】」を先頭に付けて、どの作品のシーンかを明記してください（例: "【鬼滅の刃】炭治郎が修行した場所"）
- 聖地スポットデータがある場合は各作品から2つ以上を必ず組み込み、さらに周辺の関連スポットも追加してください
- 聖地スポットデータがない作品でも、あなたの知識でその作品の有名な聖地を2つ以上含めてください
- 緯度経度は実在する正確な値を使用してください
- nearby_foodは実在する可能性の高い店舗・ジャンルを記載してください
- JSONのみを出力し、前後に説明文やマークダウンのコードブロックを付けないでください${getLanguageInstruction(locale)}`;
}

const JSON_FORMAT_SECTION = `## 出力JSON形式（厳密に従ってください）
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
}`;

const RULES_SECTION = `## ルール
- 1日あたり3〜5スポットを含めてください
- 移動の効率を考慮してスポットを並べてください
- 聖地スポットデータがある場合は必ず組み込み、さらに周辺の関連スポットも追加してください
- 緯度経度は実在する正確な値を使用してください
- nearby_foodは実在する可能性の高い店舗・ジャンルを記載してください
- JSONのみを出力し、前後に説明文やマークダウンのコードブロックを付けないでください`;

function parseGeneratedPlan(text: string): GeneratedPlan {
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
      if (attempt < maxRetries) continue;
    }
  }

  throw lastError ?? new Error('Failed to generate plan');
}

/** Supabaseから作品のスポットを取得 */
async function fetchSpotsForKeyword(
  keyword: string
): Promise<{ spots: PilgrimageSpot[]; workTitle: string }> {
  try {
    const supabase = getSupabase();
    const { data: works } = await supabase
      .from('anime_works')
      .select('id, title')
      .or(`title.ilike.%${keyword}%,title_en.ilike.%${keyword}%`);

    if (works && works.length > 0) {
      const workTitle = works[0].title;
      const workIds = works.map((w) => w.id);
      const { data: spotData } = await supabase
        .from('pilgrimage_spots')
        .select('*')
        .in('work_id', workIds);

      return {
        spots: (spotData as PilgrimageSpot[]) ?? [],
        workTitle,
      };
    }
  } catch {
    // Supabase未設定時は空を返す
  }

  return { spots: [], workTitle: keyword };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PlanRequest;
    const locale = parseLocale(body.locale);

    // --- バリデーション ---
    if (!body.keyword || !body.days || !body.theme) {
      return NextResponse.json(
        { error: 'keyword, days, theme は必須です' },
        { status: 400 }
      );
    }

    // --- 使用量チェック ---
    let userId: string | null = null;
    let pro = false;

    try {
      const authSupabase = createSupabaseServer();
      const { data: { user } } = await authSupabase.auth.getUser();
      userId = user?.id ?? null;
      if (userId) {
        pro = await isProUser(userId);
      }
    } catch {
      // Auth未設定時はスキップ
    }

    const sessionId = request.cookies.get('anon_session_id')?.value ?? '';

    try {
      const usageCheck = await checkUsageLimit(userId, sessionId, pro);
      if (!usageCheck.allowed) {
        return NextResponse.json(
          {
            error: '今月の無料プラン生成回数を超えました。',
            code: 'USAGE_LIMIT_EXCEEDED',
            used: usageCheck.used,
            limit: usageCheck.limit,
          },
          { status: 403 }
        );
      }
    } catch {
      // Usage check 失敗時はデフォルトで許可
    }

    // --- 複数作品チェック ---
    const keywords: string[] = body.keywords
      ? Array.isArray(body.keywords)
        ? body.keywords.slice(0, pro ? 3 : 1)
        : [body.keywords]
      : [body.keyword];

    if (keywords.length > 1 && !pro) {
      return NextResponse.json(
        {
          error: '複数作品の選択はProプランの機能です。',
          code: 'PRO_REQUIRED',
          feature: 'multi_work',
        },
        { status: 403 }
      );
    }

    // --- スポットデータ取得 + プロンプト構築 ---
    let prompt: string;

    if (keywords.length > 1) {
      // 複数作品
      const workSpotsMap = new Map<string, PilgrimageSpot[]>();
      for (const kw of keywords) {
        const { spots, workTitle } = await fetchSpotsForKeyword(kw);
        workSpotsMap.set(workTitle, spots);
      }
      prompt = buildMultiWorkPrompt(body, workSpotsMap, locale);
    } else {
      // 単一作品（既存動作）
      const { spots, workTitle } = await fetchSpotsForKeyword(body.keyword);
      prompt = buildPrompt(body, spots, workTitle, locale);
    }

    // --- Claude APIでプラン生成 ---
    const plan = await callClaude(prompt);

    // --- 使用量記録 ---
    try {
      await recordUsage(userId, sessionId);
    } catch {
      // 記録失敗はプラン返却に影響しない
    }

    // --- 生成結果をSupabaseに保存 ---
    try {
      const supabase = getSupabase();
      await supabase.from('generated_plans').insert({
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
        user_id: userId,
      });
    } catch (insertError) {
      console.error('Failed to save plan:', insertError);
    }

    return NextResponse.json(plan);
  } catch (error) {
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
