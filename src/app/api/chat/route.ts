import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseServer } from '@/lib/supabase-server';
import { isProUser } from '@/lib/subscription';

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

const SYSTEM_PROMPT = `あなたはアニメ聖地巡礼の専門アドバイザーです。ユーザーの旅行プランについてカスタマイズの相談に乗ります。

対応できること:
- 聖地巡礼のルート相談
- アニメ作品の聖地情報
- 旅行スケジュールの調整
- 周辺の観光スポットやグルメ情報
- 交通手段のアドバイス
- 宿泊のアドバイス

回答は簡潔で親しみやすい日本語で、200文字以内を目安にしてください。`;

const CHAT_LIMIT_FREE = 1;

async function getChatUsage(
  userId: string | null,
  sessionId: string
): Promise<number> {
  try {
    const supabase = (await import('@/lib/supabase')).getSupabase();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    if (userId) {
      const { count } = await supabase
        .from('chat_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', monthStart);
      return count ?? 0;
    }

    if (sessionId) {
      const { count } = await supabase
        .from('chat_usage')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .gte('created_at', monthStart);
      return count ?? 0;
    }

    return 0;
  } catch {
    return 0;
  }
}

async function recordChatUsage(
  userId: string | null,
  sessionId: string
): Promise<void> {
  try {
    const supabase = (await import('@/lib/supabase')).getSupabase();
    await supabase.from('chat_usage').insert({
      user_id: userId,
      session_id: sessionId || null,
    });
  } catch {
    // 記録失敗は無視
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    // ユーザー認証チェック
    let userId: string | null = null;
    let pro = false;

    try {
      const supabase = createSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
      if (userId) {
        pro = await isProUser(userId);
      }
    } catch {
      // Auth未設定
    }

    const sessionId = request.cookies.get('anon_session_id')?.value ?? '';

    // 使用量チェック（Proは無制限）
    if (!pro) {
      const used = await getChatUsage(userId, sessionId);
      if (used >= CHAT_LIMIT_FREE) {
        return NextResponse.json(
          {
            error: 'チャットの無料利用回数を超えました。プロプランに登録すると無制限でご利用いただけます。',
            code: 'CHAT_LIMIT_EXCEEDED',
            used,
            limit: CHAT_LIMIT_FREE,
          },
          { status: 403 }
        );
      }
    }

    // Claude API呼び出し
    const apiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const response = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    const block = response.content[0];
    if (block.type !== 'text') {
      return NextResponse.json(
        { error: '応答の生成に失敗しました' },
        { status: 500 }
      );
    }

    // 使用量記録（最初のユーザーメッセージ時のみカウント）
    if (messages.length === 1 && !pro) {
      await recordChatUsage(userId, sessionId);
    }

    return NextResponse.json({ reply: block.text });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'APIのレート制限に達しました。しばらく待ってから再度お試しください。' },
        { status: 429 }
      );
    }

    console.error('chat error:', error);
    return NextResponse.json(
      { error: 'チャットの処理に失敗しました。' },
      { status: 500 }
    );
  }
}
