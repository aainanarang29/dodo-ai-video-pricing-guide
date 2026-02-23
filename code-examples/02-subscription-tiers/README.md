# Subscription Tiers Pricing Model

**Best for:** Avatar/editing tools (Synthesia, HeyGen, CapCut)  
**Conversion rate:** 5-8%  
**Example ARR:** $200-600 per user

## Overview

Monthly subscription with clear usage limits based on:
- **Minutes of video** generated/month
- **Number of exports** per month
- **Storage limits** for projects
- **Feature access** (HD vs 4K, avatar library)

## Real-World Example: Synthesia

```
Starter:    $29/month → 10 minutes of avatar video
Creator:    $89/month → 30 minutes + custom avatars
Enterprise: Custom   → Unlimited + API access
```

## Implementation

### 1. Product Setup
```bash
# Create three subscription tiers
node setup/create-products.ts
```

Creates:
- **Starter Plan:** $29/mo, 10 exports, 1080p, 5GB storage
- **Creator Plan:** $89/mo, 50 exports, 4K, 50GB storage
- **Pro Plan:** $199/mo, unlimited exports, 4K, 200GB storage

### 2. Subscribe Users
```typescript
import { createSubscription } from './setup/subscribe';

const paymentLink = await createSubscription(userId, planId);
// Redirect user to payment link
```

### 3. Track Usage
```typescript
import { canExportVideo, recordExport } from './webhooks/usage-tracking';

// Before allowing export
const { allowed, reason } = await canExportVideo(userId);
if (!allowed) {
  return { error: reason };
}

// After successful export
await recordExport(userId, videoSizeInBytes);
```

### 4. Handle Subscription Events
```typescript
import { handleSubscriptionWebhook } from './webhooks/subscription-renewal';

// In your webhook endpoint
app.post('/webhooks/dodo', async (req, res) => {
  const event = req.body;
  await handleSubscriptionWebhook(event);
  res.json({ received: true });
});
```

### 5. Manage Plan Changes
```typescript
import { upgradeSubscription } from './management/plan-upgrades';

// When user upgrades
await upgradeSubscription(subscriptionId, newPlanId);
// User gets new limits immediately, prorated billing
```

## Database Schema

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  dodo_subscription_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(255),
  status VARCHAR(50),
  limits JSONB,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_tracker (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subscription_id VARCHAR(255),
  period JSONB, -- {start, end}
  exports_used INTEGER DEFAULT 0,
  storage_used_gb DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subscription_id, period)
);

-- Usage records
CREATE TABLE usage_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  timestamp TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Limit Enforcement

### What happens at limit:

**Soft limit (recommended):**
- User can generate videos
- Cannot export (paywall appears)
- Higher conversion: user invested time

**Hard limit:**
- Cannot generate more
- Immediate upgrade prompt
- Risk: user bounces

**Overage:**
- Additional minutes at premium rate
- Example: $9/minute over limit

## Conversion Optimization

### ✅ DO:
- 14-day free trial (builds habit)
- Show usage in real-time ("7/10 exports used")
- Upgrade prompts when 80% used
- Annual discount (20% off = predictable revenue)
- Feature-based tiers (not just limits)

### ❌ DON'T:
- Hide pricing until user invests time
- Punish with hard limits
- Complex multi-dimensional limits
- Change prices mid-period

## Testing

```typescript
// Test subscription creation
const subscription = await createSubscription('test-user-id', 'starter-plan-id');
console.log('Payment link:', subscription);

// Test usage tracking
const canExport = await canExportVideo('test-user-id');
console.log('Can export:', canExport);

// Test limit enforcement
await recordExport('test-user-id', 1024 * 1024 * 100); // 100MB
const afterExport = await canExportVideo('test-user-id');
console.log('After export:', afterExport);
```

## Production Considerations

1. **Proration handling:** Dodo handles this automatically with `prorated_immediately`
2. **Grace periods:** Allow 1-2 days after limit before hard blocking
3. **Notification emails:** Alert users at 50%, 80%, 100% usage
4. **Admin overrides:** Support team can adjust limits manually
5. **Downgrade protection:** Prevent data loss when downgrading

## Why This Model?

**Pros:**
- Predictable revenue
- Enterprise-friendly (fixed budgets)
- Clear value ladder
- Annual contracts boost cash flow

**Cons:**
- Lower conversion than freemium
- Requires trial period investment
- Usage tracking complexity
- Overage billing edge cases

## Next Steps

1. Set up Dodo webhook endpoint
2. Implement usage tracking in your app
3. Add upgrade flows in UI
4. Configure email notifications
5. Test with Dodo test mode

---

**Need help?** Check the [main README](../../README.md) or [Dodo docs](https://docs.dodopayments.com)
