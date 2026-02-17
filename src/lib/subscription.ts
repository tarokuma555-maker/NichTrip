import { createClient } from '@supabase/supabase-js';

/**
 * Service role client for server-side subscription operations.
 * Falls back to anon key if service role is not set.
 */
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url === 'your_url_here') {
    return null;
  }

  return createClient(url, serviceKey || anonKey || '');
}

export async function getSubscription(userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function isProUser(userId: string, email?: string | null): Promise<boolean> {
  // 管理者は常にPro
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && email === adminEmail) return true;

  const sub = await getSubscription(userId);
  return sub?.status === 'active' || sub?.status === 'trialing';
}

export async function getStripeCustomerId(
  userId: string
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  return data?.stripe_customer_id ?? null;
}
