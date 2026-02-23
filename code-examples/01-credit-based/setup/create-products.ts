import { Dodo } from '@dodopayments/dodo-ts-sdk';

const dodo = new Dodo({
  bearerToken: process.env.DODO_API_KEY!,
});

// Create credit packages
const creditPackages = [
  {
    name: 'Starter Pack',
    price: 10_00, // $10 in cents
    credits: 100,
    bonus: 0,
  },
  {
    name: 'Pro Pack',
    price: 40_00, // $40
    credits: 500,
    bonus: 100, // 20% bonus
  },
  {
    name: 'Business Pack',
    price: 120_00, // $120
    credits: 2000,
    bonus: 500, // 25% bonus
  }
];

export async function createCreditProducts() {
  for (const pkg of creditPackages) {
    await dodo.products.create({
      name: pkg.name,
      price: {
        type: 'one_time_price',
        price: pkg.price,
        currency: 'USD',
        discount: 0,
        purchasing_power_parity: false,
      },
      tax_category: 'digital_products',
      metadata: { 
        credits: pkg.credits,
        bonus_credits: pkg.bonus,
        total_credits: pkg.credits + pkg.bonus,
      },
    });
  }
}
