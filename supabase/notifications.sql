-- =============================================================
--  Tabla `notifications` — notificaciones in-app
-- =============================================================
--  Cada usuario tiene un feed de notificaciones que puede
--  marcar como leídas. Los eventos del sistema (webhook Stripe,
--  cambios de rol, etc.) insertan aquí.
-- =============================================================

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null,                    -- 'billing.success', 'billing.failed', 'role.changed', 'system', ...
  title      text not null,
  body       text,
  read       boolean not null default false,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx
  on public.notifications (user_id, read, created_at desc)
  where read = false;

alter table public.notifications enable row level security;

-- Un usuario puede ver/sus notificaciones
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

-- Un usuario puede marcar como leídas sus notificaciones
drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Un usuario puede borrar sus notificaciones
drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- Service role puede insertar (webhooks, sistema)
drop policy if exists "notifications_service_role_insert" on public.notifications;
create policy "notifications_service_role_insert"
  on public.notifications for insert to service_role, authenticated
  with check (true);
