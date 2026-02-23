import { db } from '../../../lib/database';

// Track monthly usage
interface UsageTracker {
  userId: string;
  subscriptionId: string;
  period: { start: Date; end: Date };
  usage: {
    exports_used: number;
    storage_used_gb: number;
  };
  limits: {
    exports_per_month: number;
    storage_gb: number;
  };
}

async function getCurrentSubscription(userId: string) {
  return await db.subscription.findFirst({
    where: { 
      userId,
      status: 'active',
    },
    include: {
      plan: true,
    }
  });
}

async function getMonthlyUsage(userId: string) {
  const currentPeriod = getCurrentBillingPeriod();
  
  return await db.usageTracker.findFirst({
    where: {
      userId,
      period: currentPeriod,
    }
  });
}

function getCurrentBillingPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return { start, end };
}

export async function canExportVideo(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const subscription = await getCurrentSubscription(userId);
  const usage = await getMonthlyUsage(userId);

  // Check export limit (-1 means unlimited)
  if (subscription.limits.exports_per_month !== -1 && 
      usage.exports_used >= subscription.limits.exports_per_month) {
    return {
      allowed: false,
      reason: `Monthly export limit reached (${usage.exports_used}/${subscription.limits.exports_per_month})`
    };
  }

  return { allowed: true };
}

export async function recordExport(userId: string, videoSize: number) {
  await db.usageRecord.create({
    data: {
      userId,
      type: 'export',
      timestamp: new Date(),
      metadata: { videoSize },
    }
  });
}
