-- =============================================================
--  Tabla `audit_logs` — trazabilidad de acciones admin
-- =============================================================
--  Registra cambios de rol, bans, webhooks procesados, etc.
--  Solo el service_role (webhook backend) y admins pueden escribir.
--  Solo admins pueden leer.
-- =============================================================

create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users (id) on delete set null,
  action      text not null,             -- 'role.change', 'user.ban', 'webhook.processed', ...
  target_id   uuid,                       -- usuario afectado (si aplica)
  target_type text,                       -- 'user' | 'subscription' | 'webhook' | ...
  metadata    jsonb,                       -- contexto adicional
  created_at  timestamptz not null default now()
);

create index if not exists audit_logs_actor_idx
  on public.audit_logs (actor_id, created_at desc);
create index if not exists audit_logs_target_idx
  on public.audit_logs (target_id, created_at desc);
create index if not exists audit_logs_action_idx
  on public.audit_logs (action, created_at desc);

alter table public.audit_logs enable row level security;

-- Lectura: solo admins (rol almacenado en profiles)
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read"
  on public.audit_logs for select
  to authenticated
  using (
    exists(
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Escritura: service_role (webhooks) o el propio usuario admin
drop policy if exists "audit_logs_service_role_insert" on public.audit_logs;
create policy "audit_logs_service_role_insert"
  on public.audit_logs for insert
  to service_role, authenticated
  with check (true);

-- Helper para registrar acciones desde el backend
create or replace function public.log_action(
  p_actor uuid,
  p_action text,
  p_target uuid default null,
  p_target_type text default null,
  p_metadata jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.audit_logs (actor_id, action, target_id, target_type, metadata)
  values (p_actor, p_action, p_target, p_target_type, p_metadata)
  returning id into v_id;
  return v_id;
end;
$$;
