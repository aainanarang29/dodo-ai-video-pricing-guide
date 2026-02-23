import { Dodo } from '@dodopayments/dodo-ts-sdk';
import { db } from '../../../lib/database';

const dodo = new Dodo({
  apiKey: process.env.DODO_API_KEY!,
});

// Upgrade subscription with proration
export async function upgradeSubscription(
  subscriptionId: string, 
  newPlanId: string
) {
  const updatedSubscription = await dodo.subscriptions.changePlan(
    subscriptionId,
    {
      product_id: newPlanId,
      quantity: 1,
      proration_billing_mode: 'prorated_immediately',
    }
  );

  // Update user's limits immediately
  const product = await dodo.products.retrieve(newPlanId);
  const newLimits = product.metadata;
  
  await db.subscription.update({
    where: { dodoSubscriptionId: subscriptionId },
    data: { 
      limits: newLimits,
      planId: newPlanId,
    }
  });

  return updatedSubscription;
}
