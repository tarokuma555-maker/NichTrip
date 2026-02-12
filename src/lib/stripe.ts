import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'sk_test_xxxx') {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(key, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PRICE_IDS = {
  promo: process.env.STRIPE_PRICE_ID_PROMO ?? process.env.STRIPE_PRICE_PROMO_ID ?? '',
  regular: process.env.STRIPE_PRICE_ID_REGULAR ?? process.env.STRIPE_PRICE_REGULAR_ID ?? '',
};
