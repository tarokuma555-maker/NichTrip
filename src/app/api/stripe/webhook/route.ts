import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Service role client（RLSバイパス）
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.supabase_user_id;

        if (!userId || !subscriptionId) break;

        // Subscription詳細取得
        const subscription: Stripe.Subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const item = subscription.items.data[0];

        // DB保存
        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: item.price.id,
            status: subscription.status,
            current_period_start: new Date(
              item.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              item.current_period_end * 1000
            ).toISOString(),
            billing_cycle_count: 1,
          },
          { onConflict: 'stripe_subscription_id' }
        );

        // Subscription Schedule: 3ヶ月promo → regular
        if (subscription.metadata?.promo_phase === 'true') {
          try {
            await stripe.subscriptionSchedules.create({
              from_subscription: subscriptionId,
              phases: [
                {
                  items: [{ price: PRICE_IDS.promo, quantity: 1 }],
                  duration: { interval: 'month', interval_count: 3 },
                },
                {
                  items: [{ price: PRICE_IDS.regular, quantity: 1 }],
                },
              ],
            });
          } catch (scheduleErr) {
            console.error(
              'Failed to create subscription schedule:',
              scheduleErr
            );
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const updatedItem = subscription.items.data[0];
        await supabase
          .from('subscriptions')
          .update({
            stripe_price_id: updatedItem.price.id,
            status: subscription.status,
            current_period_start: new Date(
              updatedItem.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              updatedItem.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subDetails = invoice.parent?.subscription_details;
        const subscriptionId =
          typeof subDetails?.subscription === 'string'
            ? subDetails.subscription
            : subDetails?.subscription?.id;
        if (!subscriptionId) break;

        const { data: existing } = await supabase
          .from('subscriptions')
          .select('billing_cycle_count')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (existing) {
          await supabase
            .from('subscriptions')
            .update({
              billing_cycle_count: (existing.billing_cycle_count || 0) + 1,
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const failedSubDetails = invoice.parent?.subscription_details;
        const subscriptionId =
          typeof failedSubDetails?.subscription === 'string'
            ? failedSubDetails.subscription
            : failedSubDetails?.subscription?.id;
        if (!subscriptionId) break;

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return NextResponse.json({ received: true });
}
