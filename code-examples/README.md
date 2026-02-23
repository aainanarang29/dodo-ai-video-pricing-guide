# AI Video Pricing Models - Code Examples

Production-ready TypeScript implementations of all 7 pricing models using Dodo Payments.

---

## 📚 Quick Navigation

| Model | Conversion | Best For | Code |
|-------|-----------|----------|------|
| [1. Credit-Based](#1-credit-based-pricing) | 8-15% | Variable usage, experimentation | [View Code →](./01-credit-based/) |
| [2. Subscription Tiers](#2-subscription-tiers) | 5-8% | Predictable workflows | [View Code →](./02-subscription-tiers/) |
| [3. Freemium + Watermark](#3-freemium-watermark) | **25-34%** 🔥 | Viral growth, sunk-cost | [View Code →](./03-freemium-watermark/) |
| [4. Metered Billing](#4-metered-billing) | 12-18% | API-first, developers | [View Code →](./04-metered-billing/) |
| [5. Hybrid Model](#5-hybrid-model) | 10-15% | Power users, enterprise | [View Code →](./05-hybrid-model/) |
| [6. Enterprise Pooling](#6-enterprise-pooling) | 15-20% | Team collaboration | [View Code →](./06-enterprise-pooling/) |
| [7. Custom Enterprise](#7-custom-enterprise) | 2-5% (high AOV) | White-label, SLAs | [View Code →](./07-custom-enterprise/) |

---

## 🚀 Quick Start

### Prerequisites

```bash
npm install @dodopayments/dodo-ts-sdk
```

### Environment Setup

```bash
# .env
DODO_API_KEY=your_test_api_key
DODO_MODE=test
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

### Pick Your Model

```bash
# Navigate to your chosen pricing model
cd 01-credit-based

# Review the README
cat README.md

# Check the implementation files
ls -R
```

---

## 1. Credit-Based Pricing

**Example:** Runway ML  
**Files:** 4 TypeScript modules

**What's included:**
- ✅ Product creation with credit packages
- ✅ Purchase flow with Dodo checkout
- ✅ Webhook handler for credit addition
- ✅ Usage tracking with atomic transactions

**When to use:**
- Variable GPU costs per generation
- Users experimenting with different settings
- Need to prevent abuse with metered limits
- Natural upsell when credits run out

[View Implementation →](./01-credit-based/)

---

## 2. Subscription Tiers

**Example:** Synthesia  
**Files:** 5 TypeScript modules

**What's included:**
- ✅ Tiered subscription products (Basic/Pro/Enterprise)
- ✅ Usage limit tracking (minutes/month)
- ✅ Subscription renewal webhooks
- ✅ Upgrade/downgrade management
- ✅ Overage handling

**When to use:**
- Predictable usage patterns
- Enterprise customers want fixed budgets
- Clear feature differentiation
- Recurring revenue priority

[View Implementation →](./02-subscription-tiers/)

---

## 3. Freemium + Watermark Removal

**Example:** VEED.io  
**Files:** 4 TypeScript modules

**What's included:**
- ✅ Free tier with watermarked exports
- ✅ Upgrade trigger at export point
- ✅ Watermark removal after payment
- ✅ Sunk-cost optimization (highest conversion!)

**When to use:**
- Want viral growth via free tier
- Users invest time before upgrading
- Export is the conversion moment
- Can afford infrastructure for free users

[View Implementation →](./03-freemium-watermark/)

---

## 4. Pay-Per-Use Metered Billing

**Example:** Google Veo 3  
**Files:** 5 TypeScript modules

**What's included:**
- ✅ Dodo metering setup
- ✅ Per-second billing tracking
- ✅ Real-time cost calculation
- ✅ Usage aggregation
- ✅ Invoice generation

**When to use:**
- API-first product
- Developer/technical audience
- Highly variable usage (10s to 10,000s of requests)
- Want perfectly aligned costs

[View Implementation →](./04-metered-billing/)

---

## 5. Hybrid: Subscription + Usage

**Example:** Runway Unlimited  
**Files:** 6 TypeScript modules

**What's included:**
- ✅ Base subscription ($76/mo)
- ✅ Included credits (2,250)
- ✅ Relaxed mode (unlimited)
- ✅ Overage credit purchases
- ✅ Combined billing

**When to use:**
- Power users with varying usage
- Want predictable base revenue
- Offer priority vs relaxed tiers
- Enterprise customers need flexibility

[View Implementation →](./05-hybrid-model/)

---

## 6. Enterprise Credit Pooling

**Example:** Team-based tools  
**Files:** 5 TypeScript modules

**What's included:**
- ✅ Team/workspace credit pools
- ✅ Usage by team member
- ✅ Pool exhaustion alerts
- ✅ Team admin dashboard
- ✅ Top-up workflow

**When to use:**
- Selling to agencies/teams
- Need team collaboration features
- Want higher contract values
- Budget approval processes

[View Implementation →](./06-enterprise-pooling/)

---

## 7. Custom Enterprise Pricing

**Example:** HeyGen Enterprise  
**Files:** 4 TypeScript modules

**What's included:**
- ✅ Custom contract creation
- ✅ White-label pricing
- ✅ SLA configuration
- ✅ Dedicated infrastructure billing
- ✅ Custom invoicing

**When to use:**
- Fortune 500 customers
- Need SOC 2, HIPAA compliance
- White-label requirements
- Dedicated GPU clusters
- High-touch sales ($5K-50K+ MRR)

[View Implementation →](./07-custom-enterprise/)

---

## 🛠️ Common Patterns

All examples follow these patterns:

### Directory Structure
```
{model-name}/
├── setup/              # Product creation, configuration
├── webhooks/           # Payment success, renewals
└── usage/              # Tracking, consumption, limits
```

### Code Conventions
- TypeScript for type safety
- Atomic database transactions
- Webhook signature verification
- Environment-based configuration
- Error handling with descriptive messages

### Database Schema Patterns
```typescript
// User credits balance
user.credits: number

// Transaction log
creditTransaction {
  userId: string
  amount: number        // positive = add, negative = consume
  type: 'purchase' | 'generation' | 'refund'
  metadata: json
}

// Subscription tracking
subscription {
  userId: string
  dodoSubscriptionId: string
  status: string
  currentPeriodEnd: datetime
}
```

---

## 📊 Decision Matrix

**Use this to choose the right model:**

| Your Situation | Best Model |
|---------------|-----------|
| API developers as main users | Metered Billing (#4) |
| Variable, unpredictable usage | Credit-Based (#1) or Hybrid (#5) |
| Want viral growth | Freemium + Watermark (#3) |
| Predictable workflows | Subscription Tiers (#2) |
| Targeting teams/agencies | Enterprise Pooling (#6) |
| Fortune 500 customers | Custom Enterprise (#7) |
| Need recurring revenue | Subscription (#2) or Hybrid (#5) |
| Export-driven product | Freemium + Watermark (#3) |
| High GPU costs | Credit-Based (#1) or Metered (#4) |

---

## 🔧 Installation

Each model is standalone. To use:

```bash
# 1. Choose your model
cd 01-credit-based

# 2. Install dependencies (if needed)
npm install @dodopayments/dodo-ts-sdk

# 3. Set environment variables
cp .env.example .env
# Edit .env with your Dodo API keys

# 4. Review and customize
# - Update product pricing in setup/
# - Modify credit costs in usage/
# - Customize webhook logic
```

---

## 📖 Additional Resources

- **[Complete Pricing Guide](../blog/ai-video-pricing-guide.mdx)** - Full blog with market research
- **[Dodo Payments Docs](https://docs.dodopayments.com)** - Official SDK documentation
- **[Main README](../README.md)** - Repository overview

---

## 🤝 Support

Need help implementing these models?

1. Read the model-specific README in each directory
2. Check the [Complete Pricing Guide](../blog/ai-video-pricing-guide.mdx)
3. Review [Dodo Payments docs](https://docs.dodopayments.com)
4. Open an issue in this repository

---

## ⚠️ Important Notes

**Test Mode:**
- All examples include test mode configuration
- Use test API keys during development
- Test webhook endpoints with Dodo's test mode

**Production:**
- Review security implications
- Add rate limiting
- Implement fraud prevention
- Set up monitoring and alerts
- Add admin tools for support team

**Compliance:**
- Review tax handling for your jurisdiction
- Consider GDPR/data privacy implications
- Add terms of service acceptance
- Implement usage limits if needed

---

<p align="center">
  <strong>Ready to implement pricing for your AI video tool?</strong><br>
  Pick a model above and start building! 🚀
</p>
