import { db } from '../../../lib/database';

function getCurrentBillingPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return { start, end };
}

// Reset usage limits on subscription renewal
export async function handleSubscriptionWebhook(event: any) {
  if (event.type === 'subscription.renewed') {
    const { user_id } = event.data.subscription.metadata;
    const subscriptionId = event.data.subscription.subscription_id;

    // Reset monthly usage counters
    const currentPeriod = getCurrentBillingPeriod();
    
    await db.usageTracker.upsert({
      where: {
        userId_subscriptionId_period: {
          userId: user_id,
          subscriptionId: subscriptionId,
          period: currentPeriod,
        }
      },
      update: {
        exports_used: 0,
        // Keep storage_used_gb (cumulative)
      },
      create: {
        userId: user_id,
        subscriptionId: subscriptionId,
        period: currentPeriod,
        exports_used: 0,
        storage_used_gb: 0,
      }
    });
  }
}
