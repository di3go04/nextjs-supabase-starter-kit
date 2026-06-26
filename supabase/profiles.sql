-- =============================================================
--  Tabla `profiles` con sistema de roles (RBAC)
-- =============================================================
--  - Cada usuario (auth.users) tiene exactamente un profile.
--  - Roles disponibles: user, free, admin, premium.
--  - Se crea automáticamente al registrarse (trigger).
--  - RLS: el usuario solo puede leer/escribir su propio profile.
--      El campo `role` solo lo puede cambiar el service_role.
-- =============================================================

create extension if not exists "pgcrypto";

create type user_role as enum ('user', 'free', 'admin', 'premium');

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  username    text unique,
  avatar_url  text,
  role        user_role not null default 'user',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- =============================================================
--  Trigger: crear profile automáticamente al crear auth.users
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    'user'  -- rol por defecto
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
--  Trigger: mantener updated_at al actualizar
-- =============================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- =============================================================
--  Row Level Security
-- =============================================================
alter table public.profiles enable row level security;

-- Lectura: cualquier usuario autenticado puede ver cualquier profile
-- (necesario para mostrar avatares, etc. en la UI).
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Update: el usuario solo puede actualizar SU propio profile.
-- El campo `role` se protege por separado (ver abajo).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =============================================================
--  Política extra: prohibir que un usuario cambie su propio `role`
--  mediante UPDATE directo. Solo service_role puede cambiarlo.
-- =============================================================
create or replace function public.can_update_role()
returns boolean
language sql
security definer
set search_path = public
as $$
  -- Si la sesión actual es service_role, permitir.
  -- auth.jwt() -> 'role' = 'service_role' => true.
  -- Cualquier otra sesión => false.
  select coalesce((auth.jwt() ->> 'role') = 'service_role', false);
$$;

-- Añadimos una política adicional sobre el UPDATE que restringe el cambio de `role`
-- a menos que venga del service_role.
drop policy if exists "profiles_update_role_restricted" on public.profiles;
create policy "profiles_update_role_restricted"
  on public.profiles for update
  to authenticated
  using (true)
  with check (
    case
      when (select public.can_update_role()) then true
      -- Si el rol NO cambia, ok.
      when (select role from public.profiles where id = auth.uid()) = new.role then true
      else false
    end
  );

-- =============================================================
--  Función helper para admin: promote/demote role.
--  Ejecutarla desde el backend con el service_role key.
-- =============================================================
create or replace function public.set_user_role(target_user uuid, new_role user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set role = new_role where id = target_user;
end;
$$;

-- =============================================================
--  (Opcional) Crea un bucket público para avatares
--  Ejecuta esto desde el panel de Supabase Storage también:
-- =============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Política: cada usuario autenticado puede subir a su propia carpeta.
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
