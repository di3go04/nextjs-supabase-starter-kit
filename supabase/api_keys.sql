-- =============================================================
--  Tabla `api_keys` — tokens personales de usuarios
-- =============================================================
--  Cada usuario puede generar N API keys para acceder a una
--  API pública (ej. /api/v1/...). Las keys se hashean con
--  SHA-256 antes de guardar — el plaintext solo se ve al crear.
-- =============================================================

create extension if not exists pgcrypto;

create table if not exists public.api_keys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  name         text not null,                       -- "Production", "Testing", ...
  key_prefix   text not null,                       -- primeros 8 chars para identificación
  key_hash     text not null unique,                -- SHA-256 hash del key completo
  last_used_at timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now(),
  revoked_at   timestamptz
);

create index if not exists api_keys_user_idx on public.api_keys (user_id, created_at desc);
create index if not exists api_keys_hash_idx on public.api_keys (key_hash) where revoked_at is null;

alter table public.api_keys enable row level security;

-- Un usuario puede ver y gestionar SUS keys (sin ver el hash)
drop policy if exists "api_keys_select_own" on public.api_keys;
create policy "api_keys_select_own"
  on public.api_keys for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "api_keys_insert_own" on public.api_keys;
create policy "api_keys_insert_own"
  on public.api_keys for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "api_keys_update_own" on public.api_keys;
create policy "api_keys_update_own"
  on public.api_keys for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "api_keys_delete_own" on public.api_keys;
create policy "api_keys_delete_own"
  on public.api_keys for delete to authenticated
  using (user_id = auth.uid());

-- Helper para hashear keys (llamado desde server action)
create or replace function public.hash_api_key(p_key text)
returns text
language sql
immutable
as $$
  select encode(digest(p_key, 'sha256'), 'hex')
$$;
