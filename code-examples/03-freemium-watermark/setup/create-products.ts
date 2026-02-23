import { Dodo } from '@dodopayments/dodo-ts-sdk';

const dodo = new Dodo({
  apiKey: process.env.DODO_API_KEY!,
});

// Create watermark removal products
export async function createWatermarkProducts() {
  // Monthly subscription for watermark removal
  const basicPlan = await dodo.products.create({
    name: 'Basic Plan - Watermark Free',
    price: {
      type: 'recurring_price',
      price: 12_00, // $12/month
      currency: 'USD',
      payment_frequency_count: 1,
      payment_frequency_interval: 'Month',
      subscription_period_count: 1,
      subscription_period_interval: 'Month',
      trial_period_days: 0, // No trial - instant value
      discount: 0,
      purchasing_power_parity: false,
    },
    tax_category: 'saas',
    metadata: {
      tier: 'basic',
      max_quality: '1080p',
      watermark_free: true,
      storage_gb: 10,
    },
  });

  // One-time watermark removal (single video)
  const oneTimeRemoval = await dodo.products.create({
    name: 'Remove Watermark (One Video)',
    price: {
      type: 'one_time_price',
      price: 5_00, // $5 per video
      currency: 'USD',
      discount: 0,
      purchasing_power_parity: false,
    },
    tax_category: 'digital_products',
    metadata: {
      type: 'watermark_removal',
      valid_for_videos: 1,
    },
  });

  return { basicPlan, oneTimeRemoval };
}
