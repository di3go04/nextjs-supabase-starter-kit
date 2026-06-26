-- =============================================================
--  Tabla `usage_events` — tracking de eventos para analíticas
-- =============================================================
--  Registra cualquier acción del usuario (login, upgrade,
--  feature_used, etc.) para alimentar el dashboard de analytics.
--
--  Uso: insert desde server actions / webhooks.
--  Lectura: solo el propio usuario (sus eventos) o admin (todos).
-- =============================================================

create table if not exists public.usage_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade,
  event_type text not null,                    -- 'auth.login', 'billing.upgrade', 'feature.used', ...
  metadata   jsonb,                             -- contexto adicional
  created_at timestamptz not null default now()
);

create index if not exists usage_events_user_idx
  on public.usage_events (user_id, created_at desc);
create index if not exists usage_events_type_idx
  on public.usage_events (event_type, created_at desc);
create index if not exists usage_events_created_idx
  on public.usage_events (created_at desc);

alter table public.usage_events enable row level security;

-- Un usuario puede ver SUS eventos
drop policy if exists "usage_events_select_own" on public.usage_events;
create policy "usage_events_select_own"
  on public.usage_events for select to authenticated
  using (user_id = auth.uid());

-- Un usuario puede registrar eventos en su nombre
drop policy if exists "usage_events_insert_own" on public.usage_events;
create policy "usage_events_insert_own"
  on public.usage_events for insert to authenticated
  with check (user_id = auth.uid());

-- Admin puede ver todos los eventos
drop policy if exists "usage_events_admin_read" on public.usage_events;
create policy "usage_events_admin_read"
  on public.usage_events for select to authenticated
  using (
    exists(
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Service role puede todo (webhook inserta eventos)
drop policy if exists "usage_events_service_role" on public.usage_events;
create policy "usage_events_service_role"
  on public.usage_events for all to service_role
  using (true) with check (true);
