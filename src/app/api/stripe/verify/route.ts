import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getStripe } from '@/lib/stripe';
import { getStripeCustomerId } from '@/lib/subscription';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * POST /api/stripe/verify
 * Stripeに直接問い合わせてサブスクリプション状態を確認し、DBに同期する。
 * Webhookに依存しないため、Webhook遅延・障害時のフォールバックとして機能する。
 */
export async function POST() {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isPro: false }, { status: 401 });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json({ isPro: false, error: 'Stripe not configured' }, { status: 503 });
    }

    // Stripe Customer IDを取得
    const customerId = await getStripeCustomerId(user.id);
    if (!customerId) {
      return NextResponse.json({ isPro: false });
    }

    // Stripeに直接問い合わせ: このカスタマーのアクティブなサブスクリプションを取得
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    // trialingも確認
    let activeSub = subscriptions.data[0];
    if (!activeSub) {
      const trialingSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: 'trialing',
        limit: 1,
      });
      activeSub = trialingSubs.data[0];
    }

    if (!activeSub) {
      return NextResponse.json({ isPro: false });
    }

    // Stripeにサブスクリプションがある → DBに同期（Webhookが失敗していた場合のリカバリ）
    const serviceSupabase = getServiceSupabase();
    const item = activeSub.items.data[0];

    await serviceSupabase.from('subscriptions').upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: activeSub.id,
        stripe_price_id: item.price.id,
        status: activeSub.status,
        current_period_start: new Date(
          item.current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          item.current_period_end * 1000
        ).toISOString(),
      },
      { onConflict: 'stripe_subscription_id' }
    );

    return NextResponse.json({ isPro: true });
  } catch (error) {
    console.error('Stripe verify error:', error);
    return NextResponse.json({ isPro: false }, { status: 500 });
  }
}
