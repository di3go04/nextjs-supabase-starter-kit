# Monetization Guide

How to actually make money with this starter kit. Practical playbook based on what works for indie SaaS in 2026.

## Table of Contents
1. [Pricing Strategy](#1-pricing-strategy)
2. [Payment Processors](#2-payment-processors)
3. [Pricing Page Conversion Tactics](#3-pricing-page-tactics)
4. [Free → Paid Conversion](#4-free-to-paid)
5. [Churn Reduction](#5-churn-reduction)
6. [Analytics You Actually Need](#6-analytics)
7. [Marketing Channels (ranked by ROI)](#7-marketing-channels)
8. [Tax & Legal Basics](#8-tax-legal)

---

## 1. Pricing Strategy

### The 3x Rule

Price your SaaS at **3x what feels comfortable**. If $19 feels right, charge $59. Most founders underprice by 60-70%.

### Tiered Pricing (recommended)

| Tier | Price | Target | Conversion % |
|------|-------|--------|--------------|
| Free | $0 | Try-before-buy | 100% of users |
| Pro | $19-49/mo | Individuals | 3-7% of free |
| Team | $99-299/mo | Small teams (5-20) | 0.5-2% of free |
| Enterprise | $499+/mo | Custom | 0.1% of free |

### Why annual plans matter

Annual plans:
- Improve cash flow (pay once, use all year).
- Reduce churn (locked in for 12 months).
- Convert 20-30% higher than monthly.

**Offer**: 2 months free on annual (= 17% discount).

### Psychological pricing

- $19 → "cheap, no-brainer"
- $29 → "still cheap, slightly more serious"
- $49 → "I need to think about it"
- $99 → "this is a real tool"
- $199+ → "I need to justify to my boss"

**Sweet spot for SaaS**: $29-49/mo for Pro.

---

## 2. Payment Processors

### Stripe (recommended)

**Pros**:
- Best developer experience.
- Webhooks, subscriptions, billing portal — all included.
- This kit is already integrated.

**Cons**:
- 2.9% + 30¢ per transaction.
- Holds funds for 2-7 days.
- Can freeze accounts without warning (read ToS carefully).

### Lemon Squeezy (alternative)

**Pros**:
- Merchant of Record (handles VAT/taxes globally).
- Better for EU sales.
- No chargeback risk.

**Cons**:
- 5% + 50¢ per transaction (higher than Stripe).
- Less mature API.

### Paddle (alternative)

Similar to Lemon Squeezy. Better for high-volume EU sales.

### Recommendation

Use **Stripe** if you're US-focused and don't want to handle VAT. Use **Lemon Squeezy** if you have many EU customers.

---

## 3. Pricing Page Tactics

### Anchoring

Show 3 tiers. The middle one should be the "most popular" with the best value. The expensive one makes the middle look cheap.

### Decoy Pricing

```
Free: $0
Pro: $29/mo  ← most popular
Team: $99/mo (only $70 more for 5 users!)
```

The Team tier makes Pro look like a steal.

### Annual Toggle

Default to annual. Show savings percentage:
```
[Monthly] [Annual - Save 17%]
```

### Social Proof

- "Joined by 500+ developers"
- "4.9/5 from 87 reviews"
- Logos of companies using your kit

### Risk Reversal

- "14-day money-back guarantee"
- "No credit card required to start"
- "Cancel anytime"

---

## 4. Free → Paid Conversion

### Free Tier Strategy

**Generous free tier** (recommended):
- 14-day full-feature trial
- Then limited free plan (not "free for 30 days then paywalled")
- Allows organic growth

**Restricted free tier**:
- Limited features from day 1
- Higher conversion % but slower growth

### Trigger Emails

Send these emails automatically:

| Day | Email | Goal |
|-----|-------|------|
| 0 | Welcome + setup tips | Activation |
| 3 | "How to use [key feature]" | Engagement |
| 7 | "You've used X of Y free quota" | Upgrade hint |
| 12 | "Compare Free vs Pro" | Conversion |
| 14 | "Your trial ends tomorrow" | Urgency |
| 30 | "Come back, here's 20% off" | Win-back |

This kit includes templates for all of these (see `src/emails/`).

### In-App Triggers

- Show upgrade modal when user hits free limit.
- Add "Pro" badge to locked features.
- Use the NotificationBell (included) to push upgrade hints.

---

## 5. Churn Reduction

### Why users churn

1. **Bad onboarding** (40% of churn) — they never activated.
2. **Price too high for value** (25%).
3. **Found alternative** (15%).
4. **Credit card failed** (10%) — fixable with dunning!
5. **Outgrew your product** (5%) — actually a good sign.
6. **Forgot they were paying** (5%) — fixable with receipts.

### Tactics

| Tactic | Impact | Effort |
|--------|--------|--------|
| Dunning emails (included) | Recover 30% of failed payments | Low |
| Annual plans | Reduce churn by 40% | Low |
| Onboarding checklist | Reduce early churn by 25% | Medium |
| Monthly "value report" email | Reduce churn by 15% | Medium |
| Exit survey | Identify root cause | Low |
| Win-back emails (30 days) | Recover 5% of churned | Low |

### The 5% Rule

If monthly churn is <5%, you're doing great. 5-10% is concerning. >10% means your product has a real problem — fix it before scaling.

---

## 6. Analytics You Actually Need

### North Star Metric

Pick ONE metric that defines success. For SaaS, usually:
- **Weekly Active Users** (engagement)
- **MRR** (revenue)
- **Activation rate** (% of signups that reach "aha moment")

This kit includes an Analytics dashboard (`/dashboard/analytics`) with MRR, churn, and user growth.

### Vanity Metrics (ignore)

- Total signups (means nothing if they don't activate)
- Page views (means nothing if they don't convert)
- Social media followers (means nothing if they don't buy)

### Real Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Activation rate | >40% | Users who reach "aha moment" |
| Free → Paid conversion | 3-7% | Healthy SaaS range |
| Monthly churn | <5% | Sustainable growth |
| LTV:CAC | >3:1 | Profitable acquisition |
| Payback period | <12 months | Healthy unit economics |

---

## 7. Marketing Channels (ranked by ROI)

### Tier 1: Build in Public (free, high ROI)

- Tweet/LinkedIn post weekly about your progress.
- Share revenue numbers, learnings, failures.
- Build audience before you need it.

**Time**: 2h/week. **ROI**: 5-10x over 6 months.

### Tier 2: SEO Content (free, slow ROI)

- Write 1 deep technical blog post per week.
- Target keywords like "next.js supabase auth", "stripe webhook idempotent".
- Each post is a permanent asset.

**Time**: 4h/post. **ROI**: compounding over 12+ months.

### Tier 3: Product Hunt launch (free, one-time)

- Launch day: 200-1000 visitors.
- If you hit top 5: 2000-5000 visitors.
- Convert 2-5% to signups, 5% of those to paid.

**Time**: 20h prep. **ROI**: one-time spike.

### Tier 4: Paid Ads (paid, scalable)

- Google Ads for intent-based search ("nextjs supabase boilerplate").
- Twitter/X ads for awareness.
- CAC target: <$30 for $29 product.

**Time**: low. **Cost**: $500-2000/month to learn. **ROI**: 2-4x if done right.

### Tier 5: Affiliate program (low effort, slow)

- Offer 30% commission to affiliates.
- Use Rewardful or FirstPromoter.
- Works best after you have 100+ customers.

---

## 8. Tax & Legal Basics

### Sole Proprietor vs LLC

- **Sole prop**: easiest, no protection. Fine for first $10k MRR.
- **LLC**: protects personal assets. Switch once you have real revenue.
- **C-Corp**: only if you plan to raise VC.

### Sales Tax / VAT

- **US**: no federal sales tax. State-by-state (Stripe Tax handles it).
- **EU**: charge VAT to EU customers (20% avg). Lemon Squeezy handles automatically.
- **UK**: 20% VAT.
- **Australia**: 10% GST.

### Stripe Tax

Add `automatic_tax: { enabled: true }` to your Checkout Session. Stripe calculates and remits. Costs 0.5% per transaction.

### Privacy Policy & ToS

You NEED these if you process payments:
- Generate with [Termly](https://termly.io) ($0-$57/mo).
- Or use [Stripe's templates](https://stripe.com/atlas/legal-library).

### GDPR

If you have EU customers:
- Cookie consent banner (this kit doesn't include — add if needed).
- Data export endpoint.
- Data deletion endpoint.
- Privacy policy mentioning data processing.

---

## TL;DR

1. **Price 3x what feels comfortable**.
2. **Annual plans** reduce churn 40%.
3. **Dunning emails** recover 30% of failed payments.
4. **5% monthly churn** is the target.
5. **Build in public** is the highest-ROI marketing.
6. **Stripe Tax** handles VAT/sales tax for 0.5%.
7. **Activation rate >40%** before scaling acquisition.

The technical foundation is in this kit. The business foundation is up to you.
