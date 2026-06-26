# Deploy Guide

Complete guide to deploy your Next.js + Supabase Starter Kit to production.

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account
- Your domain (optional, but recommended)

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/di3go04/your-repo.git
git push -u origin main
```

## Step 2 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Vercel auto-detects Next.js. **Don't override any settings**.
4. Set Environment Variables (see below).
5. Click **Deploy**.

## Step 3 — Environment Variables

Add ALL of these in Vercel → Settings → Environment Variables:

### Supabase
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service_role) |

### Stripe
| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_xxx` (or `sk_test_xxx`) |
| `STRIPE_WEBHOOK_SECRET` | Get this in Step 5 |
| `STRIPE_PRICE_ID_PRO` | `price_xxx` |
| `STRIPE_PRICE_ID_ENTERPRISE` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` |

### Resend
| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | `re_xxx` |
| `RESEND_FROM_EMAIL` | `noreply@your-domain.com` |

### App
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `es` |

### Optional (analytics)
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_xxx` |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://xxx@sentry.io/xxx` |
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `xxx` |
| `EDGE_CONFIG` | `ec_xxx` |

## Step 4 — Update Supabase URLs

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://your-domain.com`
- **Redirect URLs**:
  - `https://your-domain.com/auth/callback`
  - `https://your-app.vercel.app/auth/callback` (preview deployments)

## Step 5 — Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **+ Add endpoint**.
3. URL: `https://your-domain.com/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**.
6. On the endpoint page, copy the **Signing secret** (`whsec_xxx`).
7. Back in Vercel → Settings → Environment Variables:
   - Update `STRIPE_WEBHOOK_SECRET` = `whsec_xxx`
8. Trigger a **Redeploy**.

## Step 6 — Test the Production Flow

1. Visit `https://your-domain.com/register`.
2. Sign up with Magic Link or OAuth.
3. Verify a row appears in Supabase → Table Editor → `profiles`.
4. Go to `/dashboard/billing` and click **Upgrade**.
5. Use Stripe test card `4242 4242 4242 4242`.
6. Verify in Stripe → Events that the webhook was delivered (200 OK).
7. Verify in Supabase that:
   - `profiles.role` changed to `premium`.
   - `subscriptions` has a new row with `status=active`.
8. Check your inbox for the welcome premium email.

## Step 7 — Custom Domain (optional but recommended)

1. In Vercel → Project → Settings → Domains.
2. Add your domain (e.g., `your-domain.com`).
3. Add the DNS records Vercel shows you.
4. Wait for propagation (5-30 min).
5. Update `NEXT_PUBLIC_APP_URL` to match.
6. Update Stripe webhook URL if needed.
7. Update Supabase redirect URLs if needed.

## Step 8 — Set Up Analytics (optional)

### Posthog
1. Create project at [posthog.com](https://posthog.com).
2. Copy Project API key → `NEXT_PUBLIC_POSTHOG_KEY`.

### Sentry
1. Create project at [sentry.io](https://sentry.io) → Next.js.
2. Copy DSN → `NEXT_PUBLIC_SENTRY_DSN`.

### Upstash Redis (for rate limiting)
1. Create database at [upstash.com](https://upstash.com).
2. Copy REST URL and token.

## Step 9 — Stripe Live Mode

When ready to accept real payments:

1. In Stripe Dashboard, toggle **Test → Live**.
2. Replace `sk_test_xxx` with `sk_live_xxx` in Vercel.
3. Replace `pk_test_xxx` with `pk_live_xxx`.
4. Update webhook endpoint URL if needed (it stays the same).
5. Redeploy.

## Troubleshooting

### Webhook returns 400 "Webhook Error"
- Check `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret.
- Make sure your endpoint is set to receive the event types listed in Step 5.

### OAuth redirect fails
- Verify `https://your-domain.com/auth/callback` is in Supabase → Auth → URL Configuration.

### Emails not sending
- Verify your domain in Resend → Domains.
- Check `RESEND_FROM_EMAIL` matches a verified domain.

### Rate limit errors in production
- You need `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in production.
- Without them, the in-memory fallback doesn't work across Vercel serverless instances.
