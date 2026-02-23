import { Dodo } from '@dodopayments/dodo-ts-sdk';

const dodo = new Dodo({
  apiKey: process.env.DODO_API_KEY!,
});

// Create tiered subscription products
const subscriptionTiers = [
  {
    name: 'Starter Plan',
    price: 29_00, // $29/month
    features: {
      exports_per_month: 10,
      max_duration_seconds: 60,
      quality: '1080p',
      storage_gb: 5,
      features: ['basic_editor', 'stock_music'],
    }
  },
  {
    name: 'Creator Plan',
    price: 89_00,
    features: {
      exports_per_month: 50,
      max_duration_seconds: 300,
      quality: '4K',
      storage_gb: 50,
      features: ['advanced_editor', 'stock_music', 'custom_branding'],
    }
  },
  {
    name: 'Pro Plan',
    price: 199_00,
    features: {
      exports_per_month: -1, // unlimited
      max_duration_seconds: 600,
      quality: '4K',
      storage_gb: 200,
      features: ['all_features', 'priority_support', 'api_access'],
    }
  }
];

export async function createSubscriptionProducts() {
  for (const tier of subscriptionTiers) {
    await dodo.products.create({
      name: tier.name,
      price: {
        type: 'recurring_price',
        price: tier.price,
        currency: 'USD',
        payment_frequency_count: 1,
        payment_frequency_interval: 'Month',
        subscription_period_count: 1,
        subscription_period_interval: 'Month',
        trial_period_days: 14,
        discount: 0,
        purchasing_power_parity: false,
      },
      tax_category: 'saas',
      metadata: tier.features,
    });
  }
}
