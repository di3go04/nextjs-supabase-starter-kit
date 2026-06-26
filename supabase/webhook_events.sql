-- =============================================================
--  Tabla `webhook_events` — idempotencia para Stripe webhooks
-- =============================================================
--  Stripe reintenta eventos si recibe != 2xx. Sin esta tabla,
--  un mismo evento puede procesarse N veces (ej. enviar N emails
--  de bienvenida). Aquí guardamos el event.id y deduplicamos.
-- =============================================================

create table if not exists public.webhook_events (
  id           uuid primary key default gen_random_uuid(),
  event_id     text unique not null,             -- stripe event.id (ej. evt_1Abc...)
  event_type   text not null,                    -- ej. checkout.session.completed
  payload      jsonb,                             -- snapshot del event.data.object
  status       text not null default 'pending',  -- pending | processed | failed
  attempts     int not null default 0,
  last_error   text,
  processed_at timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists webhook_events_status_idx
  on public.webhook_events (status, created_at);

-- RLS: solo service_role puede tocar esta tabla.
alter table public.webhook_events enable row level security;

drop policy if exists "webhook_events_service_role_all" on public.webhook_events;
create policy "webhook_events_service_role_all"
  on public.webhook_events for all
  to service_role
  using (true)
  with check (true);
