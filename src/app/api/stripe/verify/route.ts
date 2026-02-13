import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/stripe/verify
 * Stripeに直接問い合わせてサブスクリプション状態を確認する。
 * Webhookに依存しないため、Webhook遅延・障害時でもPro状態を正しく判定できる。
 */
export async function POST() {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ isPro: false }, { status: 401 });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json({ isPro: false, error: 'Stripe not configured' }, { status: 503 });
    }

    // Stripeでこのメールアドレスのカスタマーを検索
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 5,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ isPro: false });
    }

    // 全カスタマーIDでアクティブなサブスクリプションを探す
    let activeSub = null;
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
      });
      if (subs.data[0]) {
        activeSub = subs.data[0];
        break;
      }
      // trialingも確認
      const trialSubs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'trialing',
        limit: 1,
      });
      if (trialSubs.data[0]) {
        activeSub = trialSubs.data[0];
        break;
      }
    }

    if (!activeSub) {
      return NextResponse.json({ isPro: false });
    }

    // DB同期を試みる（失敗しても isPro: true を返す）
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (serviceKey && supabaseUrl) {
        const serviceSupabase = createClient(supabaseUrl, serviceKey);
        const item = activeSub.items.data[0];
        const customerId = typeof activeSub.customer === 'string'
          ? activeSub.customer
          : activeSub.customer.id;

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
      }
    } catch (dbErr) {
      console.error('DB sync failed (non-critical):', dbErr);
    }

    return NextResponse.json({ isPro: true });
  } catch (error) {
    console.error('Stripe verify error:', error);
    return NextResponse.json({ isPro: false }, { status: 500 });
  }
}
