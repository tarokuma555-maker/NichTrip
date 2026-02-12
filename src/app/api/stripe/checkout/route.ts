import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { getStripeCustomerId } from '@/lib/subscription';

/**
 * Product ID (prod_...) が設定されている場合、
 * そのProductに紐づく最初のactive recurring Priceを自動取得する
 */
async function resolvePriceId(
  stripe: ReturnType<typeof getStripe>,
  idOrProduct: string
): Promise<string> {
  // 既に Price ID の場合はそのまま返す
  if (idOrProduct.startsWith('price_')) {
    return idOrProduct;
  }

  // Product ID の場合 → Price を取得
  if (idOrProduct.startsWith('prod_')) {
    const prices = await stripe.prices.list({
      product: idOrProduct,
      active: true,
      type: 'recurring',
      limit: 1,
    });

    if (prices.data.length > 0) {
      return prices.data[0].id;
    }

    // recurring が無ければ one_time も試す
    const allPrices = await stripe.prices.list({
      product: idOrProduct,
      active: true,
      limit: 1,
    });

    if (allPrices.data.length > 0) {
      return allPrices.data[0].id;
    }

    throw new Error(
      `Product ${idOrProduct} に紐づく有効な料金が見つかりません。Stripeダッシュボードで料金を追加してください。`
    );
  }

  // そのまま返す（price_ prefixが無い場合も一応試す）
  return idOrProduct;
}

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

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      console.error('Stripe not configured');
      return NextResponse.json(
        { error: 'Stripe決済が設定されていません。管理者にお問い合わせください。' },
        { status: 503 }
      );
    }

    const configuredId = PRICE_IDS.promo;
    if (!configuredId) {
      console.error('STRIPE_PRICE_ID_PROMO is not configured');
      return NextResponse.json(
        { error: '料金プランが設定されていません。管理者にお問い合わせください。' },
        { status: 503 }
      );
    }

    // Product ID → Price ID の自動解決
    let priceId: string;
    try {
      priceId = await resolvePriceId(stripe, configuredId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '料金IDの取得に失敗しました';
      console.error('Price ID resolution error:', msg);
      return NextResponse.json({ error: msg }, { status: 503 });
    }

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

      // profiles に保存（upsert でテーブルが空でも対応）
      await supabase
        .from('profiles')
        .upsert(
          { id: user.id, stripe_customer_id: customerId },
          { onConflict: 'id' }
        );
    }

    // Checkout Session 作成
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
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
    const message =
      error instanceof Error ? error.message : '決済セッションの作成に失敗しました';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
