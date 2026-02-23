# Quick Start Guide

Get up and running with AI video pricing in under 10 minutes.

---

## 🎯 What You'll Accomplish

By the end of this guide, you'll have:
1. ✅ Chosen the right pricing model for your product
2. ✅ Set up Dodo Payments
3. ✅ Implemented your first pricing flow
4. ✅ Tested payment processing

---

## Step 1: Choose Your Pricing Model (2 minutes)

Answer these questions:

**Q1: Who are your primary users?**
- API developers → **Metered Billing** (#4)
- Content creators → **Credit-Based** (#1)
- Teams/agencies → **Enterprise Pooling** (#6)
- Everyone → **Freemium + Watermark** (#3)

**Q2: How predictable is usage?**
- Very predictable → **Subscription Tiers** (#2)
- Highly variable → **Credit-Based** (#1) or **Metered** (#4)
- Mixed (power users + casual) → **Hybrid Model** (#5)

**Q3: What's your revenue goal?**
- Maximize conversions → **Freemium + Watermark** (#3) - 25-34% conversion
- Predictable MRR → **Subscription Tiers** (#2) or **Hybrid** (#5)
- High AOV enterprise → **Custom Enterprise** (#7)

**Q4: Are your costs linear?**
- Yes, predictable GPU costs → **Subscription** (#2)
- No, varies 10x per request → **Credit-Based** (#1) or **Metered** (#4)

→ **[Not sure? Use the Decision Matrix →](./code-examples/README.md#-decision-matrix)**

---

## Step 2: Set Up Dodo Payments (3 minutes)

### Create Your Account

1. Sign up at [dodopayments.com](https://dodopayments.com)
2. Get your API keys (test mode for development)
3. Install the SDK:

```bash
npm install @dodopayments/dodo-ts-sdk
```

### Configure Environment

Create `.env` file:

```bash
# Dodo Payments
DODO_API_KEY=test_sk_your_key_here
DODO_MODE=test

# Your app
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost/yourdb
```

### Initialize SDK

```typescript
import { Dodo } from '@dodopayments/dodo-ts-sdk';

const dodo = new Dodo({
  bearerToken: process.env.DODO_API_KEY!,
});
```

---

## Step 3: Implement Your Model (5 minutes)

### Example: Credit-Based Pricing

**3.1 Create Products**

```typescript
// code-examples/01-credit-based/setup/create-products.ts
await dodo.products.create({
  name: 'Pro Pack',
  price: {
    type: 'one_time_price',
    price: 40_00, // $40 in cents
    currency: 'USD',
    discount: 0,
    purchasing_power_parity: false,
  },
  tax_category: 'digital_products',
  metadata: { 
    credits: 500,
    bonus_credits: 100,
    total_credits: 600,
  },
});
```

**3.2 Handle Purchase**

```typescript
// code-examples/01-credit-based/setup/purchase-handler.ts
const payment = await dodo.payments.create({
  payment_link: true,
  product_cart: [
    { product_id: productId, quantity: 1 }
  ],
  customer: {
    email: user.email,
    name: user.name,
  },
  billing: {
    country: user.country || 'US',
  },
  return_url: `${process.env.APP_URL}/dashboard?purchase=success`,
  metadata: {
    user_id: userId,
    purchase_type: 'credit_package',
  },
});

// Return this link to user
return payment.payment_link;
```

**3.3 Process Webhook**

```typescript
// code-examples/01-credit-based/webhooks/payment-success.ts
export async function handlePaymentWebhook(event: any) {
  if (event.type === 'payment.succeeded') {
    const { user_id } = event.data.payment.metadata;
    const product = event.data.payment.line_items[0];
    const { total_credits } = product.metadata;

    // Add credits to user balance
    await db.user.update({
      where: { id: user_id },
      data: {
        credits: { increment: total_credits }
      }
    });
  }
}
```

**3.4 Track Usage**

```typescript
// code-examples/01-credit-based/usage/track-consumption.ts
export async function generateVideo(userId: string, params: any) {
  const creditCost = calculateCreditCost(params);
  
  // Deduct credits
  await db.user.update({
    where: { id: userId },
    data: { 
      credits: { decrement: creditCost } 
    }
  });
  
  return await queueVideoGeneration(userId, params);
}
```

---

## Step 4: Test It (2 minutes)

### Test Mode Checklist

✅ Products created in Dodo Dashboard  
✅ Test payment completes successfully  
✅ Webhook receives payment event  
✅ User balance updated correctly  
✅ Credits deducted on usage  

### Test Cards

Use Dodo's test mode with these cards:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

---

## Next Steps

### Production Deployment

1. **Switch to Live Mode**
   ```bash
   DODO_API_KEY=live_sk_your_key_here
   DODO_MODE=live
   ```

2. **Security Checklist**
   - [ ] Verify webhook signatures
   - [ ] Add rate limiting
   - [ ] Implement fraud detection
   - [ ] Set up error monitoring

3. **Launch Checklist**
   - [ ] Test all payment flows
   - [ ] Review pricing vs competitors
   - [ ] Set up customer support
   - [ ] Monitor conversion rates

### Optimization

1. **Week 1: Gather Data**
   - Track conversion rates
   - Monitor credit consumption patterns
   - Identify friction points

2. **Week 2-4: Optimize**
   - A/B test pricing tiers
   - Adjust credit costs based on GPU usage
   - Add bonus credits to improve conversion
   - Test upgrade prompts

3. **Month 2+: Scale**
   - Add enterprise tier
   - Implement team features
   - Build analytics dashboard
   - Launch referral program

---

## 🆘 Troubleshooting

### Webhook Not Receiving Events?

1. Check webhook URL in Dodo Dashboard
2. Verify endpoint is publicly accessible
3. Check webhook signature verification
4. Review Dodo webhook logs

### Credits Not Being Added?

1. Verify webhook handler is running
2. Check product metadata has `total_credits`
3. Review database transaction logs
4. Test with Dodo Dashboard webhook tester

### Users Can't Complete Payment?

1. Verify test mode if using test cards
2. Check billing country is supported
3. Review error messages in payment flow
4. Test with different browsers

---

## 📚 Additional Resources

**Full Documentation:**
- [Complete Pricing Guide](./blog/ai-video-pricing-guide.mdx) - All 7 models explained
- [Code Examples](./code-examples/) - All implementations
- [Decision Matrix](./code-examples/README.md#-decision-matrix) - Choose right model

**Dodo Payments:**
- [Documentation](https://docs.dodopayments.com)
- [TypeScript SDK](https://github.com/dodopayments/dodo-ts-sdk)
- [API Reference](https://docs.dodopayments.com/api)

**Community:**
- [GitHub Issues](https://github.com/yourusername/repo/issues)
- [Dodo Discord](https://discord.gg/dodopayments)

---

## ✨ Success Story Template

Once you're live, share your results!

```markdown
🎉 We launched [your product] with [pricing model] and saw:
- X% conversion rate (vs Y% industry average)
- $Z MRR in first month
- N happy customers
```

---

<p align="center">
  <strong>Ready to build? Pick your model and dive in!</strong><br>
  <a href="./code-examples/">View All Code Examples →</a>
</p>
