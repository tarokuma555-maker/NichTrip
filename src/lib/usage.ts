import { createClient } from '@supabase/supabase-js';

const FREE_MONTHLY_LIMIT = 3;

function getSupabaseForUsage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url === 'your_url_here') {
    return null;
  }

  return createClient(url, serviceKey || anonKey || '');
}

export async function getUsageCount(
  userId: string | null,
  sessionId: string
): Promise<number> {
  const supabase = getSupabaseForUsage();
  if (!supabase) return 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let query = supabase
    .from('usage_logs')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .eq('action', 'generate_plan');

  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('session_id', sessionId);
  }

  const { count } = await query;
  return count ?? 0;
}

export async function checkUsageLimit(
  userId: string | null,
  sessionId: string,
  isPro: boolean
): Promise<{ allowed: boolean; used: number; limit: number | null }> {
  if (isPro) {
    return { allowed: true, used: 0, limit: null };
  }

  const used = await getUsageCount(userId, sessionId);
  return {
    allowed: used < FREE_MONTHLY_LIMIT,
    used,
    limit: FREE_MONTHLY_LIMIT,
  };
}

export async function recordUsage(
  userId: string | null,
  sessionId: string
): Promise<void> {
  const supabase = getSupabaseForUsage();
  if (!supabase) return;

  await supabase.from('usage_logs').insert({
    user_id: userId,
    session_id: sessionId,
    action: 'generate_plan',
  });
}
