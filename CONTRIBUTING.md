# Contributing to Next.js + Supabase Starter Kit

Thanks for your interest in contributing! 🎉

This project is a commercial-grade SaaS starter kit. We welcome contributions that improve code quality, fix bugs, or add features that benefit all buyers.

## Quick Start

```bash
git clone https://github.com/your-username/nextjs-supabase-starter-kit.git
cd nextjs-supabase-starter-kit
bun install
cp .env.local.example .env.local
# Fill in your test credentials
bun run dev
```

## Development Workflow

1. **Fork** the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. **Make changes** following our code style (enforced by ESLint + Prettier).
3. **Run checks** before committing:
   ```bash
   bun run lint
   bun run typecheck
   bun run test
   ```
4. **Write tests** for new features. We require at least 80% coverage on `src/lib/` and `src/app/actions/`.
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(billing): add proration support"
   git commit -m "fix(webhook): handle duplicate events"
   git commit -m "docs: add Docker setup guide"
   ```
6. **Open a Pull Request** with a clear description of what and why.

## Code Style

- **TypeScript strict mode** — no `any` unless absolutely necessary (and add a comment).
- **Server Components by default** — only mark `'use client'` when you need interactivity.
- **Use Server Actions** for mutations, not API routes (unless it's a webhook).
- **`getUser()` not `getSession()`** in server code (security).
- **Zod for validation** in all server actions.
- **shadcn/ui** for components — don't add new UI libraries unless discussed.
- **Tailwind classes** — no inline styles except for dynamic values.
- **i18n keys** — all user-facing strings go through `useTranslations()`.

## Project Structure

See `README.md` for the full tree. Key conventions:

- `src/lib/` — pure functions, no React. Easy to unit test.
- `src/app/actions/` — Server Actions (with `"use server"`).
- `src/app/api/` — Route Handlers (webhooks only).
- `src/components/` — React components. `ui/` is shadcn-generated, don't edit by hand.
- `src/emails/` — React Email templates.
- `src/messages/` — i18n JSON files (es, en, pt).
- `supabase/` — SQL migrations (run in order).

## Reporting Bugs

Open an issue with:

1. **Reproduction steps** (numbered list).
2. **Expected vs actual behavior**.
3. **Environment**: Node version, browser, OS.
4. **Logs** — copy from browser console and server terminal.
5. **Minimal reproduction repo** (if possible).

## Suggesting Features

Before opening a feature request, check the [roadmap](./ROADMAP.md) to see if it's already planned. If not:

1. Open a Discussion (not an Issue) describing the use case.
2. Explain **why** this feature benefits most users (not just you).
3. Suggest an API / UX design.

## Security Vulnerabilities

**DO NOT open a public issue for security vulnerabilities.**

Email: security@your-starter-kit.com with:

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Suggested fix (if any)

We respond within 48h and credit you in the disclosure.

## License

By contributing, you agree that your contributions are licensed under the dual license described in [LICENSE](./LICENSE). Commercial use requires purchasing a license.

## Code of Conduct

Be respectful. We follow the [Contributor Covenant](./CODE_OF_CONDUCT.md).
