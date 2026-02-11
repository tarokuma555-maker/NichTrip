import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { getStripe } from '@/lib/stripe';
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

    const customerId = await getStripeCustomerId(user.id);
    if (!customerId) {
      return NextResponse.json(
        { error: 'Stripe顧客情報が見つかりません' },
        { status: 404 }
      );
    }

    const stripe = getStripe();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: 'ポータルの作成に失敗しました' },
      { status: 500 }
    );
  }
}
