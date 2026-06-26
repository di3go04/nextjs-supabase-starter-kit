# Security Policy

## Supported Versions

We actively support the latest minor version only:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Active support  |
| < 1.0   | ❌ Not supported   |

## Reporting a Vulnerability

**DO NOT open a public GitHub issue for security vulnerabilities.**

Email: **security@di3go04.dev**

Please include:

1. **Description** of the vulnerability and its impact.
2. **Steps to reproduce** (proof of concept if possible).
3. **Affected versions** (check `package.json` version).
4. **Suggested fix** (optional but appreciated).

### Response SLA

- **Acknowledgment**: within 48 hours.
- **Initial assessment**: within 7 days.
- **Fix or mitigation**: within 30 days for critical, 90 days for high/medium.

### Disclosure

- We follow **coordinated disclosure**.
- We credit researchers in our security advisories (unless you prefer to remain anonymous).
- We do **not** offer monetary bounties at this time, but commercial license discounts are available for valid critical reports.

## Security Best Practices (for kit buyers)

This starter kit ships with sensible security defaults:

- ✅ `getUser()` (not `getSession()`) for server-side auth.
- ✅ CSP, HSTS, X-Frame-Options, Referrer-Policy headers configured.
- ✅ Rate limiting on auth endpoints (Upstash Redis).
- ✅ Stripe webhook signature verification.
- ✅ RLS on all database tables.
- ✅ `service_role` key isolated to server-only code paths.
- ✅ Idempotent webhooks (no double-processing).

Before going to production, make sure you:

1. **Rotate all keys** (Supabase, Stripe, Resend) if they were ever committed.
2. **Review your RLS policies** — especially if you add new tables.
3. **Enable 2FA** on your Supabase, Stripe, Vercel, and Resend accounts.
4. **Set up Sentry alerts** for production errors.
5. **Configure Stripe radar rules** for fraud detection.
6. **Audit your dependencies** with `bun audit` weekly.

## Known Security Considerations

### Service Role Key

The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. It is only used in:
- `src/lib/supabase/admin.ts` → imported by webhook handler and admin actions.
- Never imported by client components.
- Never exposed via `NEXT_PUBLIC_*`.

If this key is leaked, **rotate it immediately** in Supabase Dashboard → Settings → API.

### Webhook Secret

`STRIPE_WEBHOOK_SECRET` is used to verify Stripe event signatures. If leaked, an attacker could forge webhook events. Rotate in Stripe Dashboard → Developers → Webhooks.
