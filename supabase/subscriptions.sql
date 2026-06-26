-- =============================================================
--  Tabla `subscriptions` — sincronizada con Stripe
-- =============================================================
--  - Una suscripción por usuario (1:1).
--  - stripe_customer_id se crea en el Checkout Session.
--  - stripe_subscription_id se setea al recibir customer.subscription.*.
--  - `status` refleja el estado de Stripe (trialing, active, past_due, canceled...).
--  - `plan` es tu abstracción interna (free, pro, enterprise).
-- =============================================================

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  status                 text not null default 'incomplete',
  plan                   text not null default 'free',
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_unique
  on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

-- Trigger updated_at
drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- RLS
alter table public.subscriptions enable row level security;

-- El usuario solo puede LEER su propia suscripción.
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert/Update/Delete solo desde service_role (webhook backend).
drop policy if exists "subscriptions_service_role_all" on public.subscriptions;
create policy "subscriptions_service_role_all"
  on public.subscriptions for all
  to service_role
  using (true)
  with check (true);

-- =============================================================
--  Vista útil: perfil + suscripción + plan activo
-- =============================================================
create or replace view public.user_with_plan as
select
  p.id,
  p.email,
  p.full_name,
  p.username,
  p.avatar_url,
  p.role,
  coalesce(s.plan, 'free') as plan,
  coalesce(s.status, 'none') as subscription_status,
  s.current_period_end,
  s.stripe_customer_id
from public.profiles p
left join public.subscriptions s on s.user_id = p.id;
