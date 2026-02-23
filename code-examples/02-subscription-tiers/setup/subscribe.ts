import { Dodo } from '@dodopayments/dodo-ts-sdk';
import { db } from '../../../lib/database';

const dodo = new Dodo({
  apiKey: process.env.DODO_API_KEY!,
});

// Create subscription for user
export async function createSubscription(
  userId: string, 
  planId: string
) {
  const user = await db.user.findUnique({ 
    where: { id: userId } 
  });

  const subscription = await dodo.subscriptions.create({
    payment_link: true,
    product_id: planId,
    quantity: 1,
    customer: {
      email: user.email,
      name: user.name,
    },
    billing: {
      country: user.country || 'US',
    },
    metadata: {
      user_id: userId,
    },
    return_url: `${process.env.APP_URL}/dashboard?subscription=success`,
  });

  return subscription.payment_link;
}
