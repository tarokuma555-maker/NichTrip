import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { getStripeCustomerId } from '@/lib/subscription';

export async function POST() {
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

    const stripe = getStripe();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Stripe Customer 取得 or 作成
    let customerId = await getStripeCustomerId(user.id);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // profiles に保存
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Checkout Session 作成
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS.promo, quantity: 1 }],
      success_url: `${siteUrl}/pricing?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          promo_phase: 'true',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: '決済セッションの作成に失敗しました' },
      { status: 500 }
    );
  }
}
