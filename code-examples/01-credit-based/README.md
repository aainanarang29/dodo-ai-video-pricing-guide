# Credit-Based Pricing Model

**Real-world example:** Runway ML  
**Conversion rate:** 8-15%  
**Best for:** Tools with variable usage patterns

---

## Overview

This pricing model lets users purchase credit packages and consume credits based on their usage. Perfect for AI video generation tools where costs vary significantly based on:
- Video duration (5s vs 10s)
- Quality settings (480p vs 4K)
- Model selection (Turbo vs Pro)
- Advanced features (upscaling, style transfer)

---

## File Structure

```
01-credit-based/
├── setup/
│   ├── create-products.ts    # Create credit packages in Dodo
│   └── purchase-handler.ts   # Handle credit purchases
├── webhooks/
│   └── payment-success.ts    # Add credits on successful payment
└── usage/
    └── track-consumption.ts  # Deduct credits for video generation
```

---

## Implementation Flow

### 1. Product Setup (`setup/create-products.ts`)

Creates three credit packages:
- **Starter Pack:** $10 → 100 credits
- **Pro Pack:** $40 → 600 credits (20% bonus)
- **Business Pack:** $120 → 2,500 credits (25% bonus)

Each product stores credit amounts in metadata for easy retrieval.

### 2. Purchase Flow (`setup/purchase-handler.ts`)

When a user wants to buy credits:
1. Create a Dodo payment session
2. Include user metadata for webhook processing
3. Return payment link to user
4. User completes payment

### 3. Webhook Processing (`webhooks/payment-success.ts`)

When payment succeeds:
1. Extract user_id from payment metadata
2. Extract total_credits from product metadata
3. Atomically update user balance
4. Log transaction for audit trail

### 4. Credit Consumption (`usage/track-consumption.ts`)

When user generates a video:
1. Calculate credit cost based on parameters
2. Check if user has sufficient balance
3. Atomically deduct credits
4. Log consumption for tracking
5. Queue video generation job

---

## Cost Calculation Logic

```typescript
Base Credits × Quality Multiplier × Model Multiplier = Final Cost

Example:
- 5s video (10 credits)
- 1080p quality (2.0x multiplier)
- Pro model (1.5x multiplier)
= 10 × 2.0 × 1.5 = 30 credits
```

### Pricing Tiers

| Duration | 480p | 720p | 1080p | 4K |
|----------|------|------|-------|-----|
| 5s Turbo | 5 | 8 | 10 | 15 |
| 5s Standard | 10 | 15 | 20 | 30 |
| 5s Pro | 15 | 23 | 30 | 45 |
| 10s Turbo | 10 | 15 | 20 | 30 |
| 10s Standard | 20 | 30 | 40 | 60 |
| 10s Pro | 30 | 45 | 60 | 90 |

---

## Key Features

✅ **Bonus Credits** - Encourage larger purchases with volume discounts  
✅ **Atomic Transactions** - Prevent race conditions with database transactions  
✅ **Audit Trail** - Every credit change is logged  
✅ **Flexible Pricing** - Cost scales with compute requirements  
✅ **Clear Upsell Path** - Users run out → upgrade to larger pack

---

## Conversion Optimization

### Do's ✅
- Show credit cost BEFORE generation
- Offer bonus credits on larger packs (20-25%)
- Display running balance prominently
- Show "credits remaining" after each generation
- Offer first-time purchase discount (e.g., 50% bonus on first pack)

### Don'ts ❌
- Don't expire credits (kills trust)
- Don't hide credit costs until after generation
- Don't make credit calculation opaque
- Don't offer only one package (limits upsell)
- Don't forget to show upgrade prompts when balance is low

---

## Environment Variables

```bash
DODO_API_KEY=your_api_key_here
APP_URL=https://yourapp.com
DATABASE_URL=postgresql://...
```

---

## Testing

```bash
# Test credit calculation
npm test usage/track-consumption.test.ts

# Test webhook processing
npm test webhooks/payment-success.test.ts
```

---

## Production Considerations

1. **Credit Expiry:** Consider adding expiry logic if needed for compliance
2. **Fraud Prevention:** Add rate limiting on credit consumption
3. **Support:** Build admin panel to manually adjust credits
4. **Analytics:** Track credit consumption patterns to optimize pricing
5. **Notifications:** Alert users when they're running low on credits

---

## Related Models

- **Hybrid Model** (05-hybrid-model) - Combines subscription + credits
- **Enterprise Pooling** (06-enterprise-pooling) - Team-based credit pools
