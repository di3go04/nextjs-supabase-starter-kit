-- =============================================================
--  Teams / Organizations + Invitations
-- =============================================================
--  Modelo multi-seat B2B:
--  - teams: una organización (con su propio stripe_customer_id)
--  - team_members: relación N:M con rol por equipo
--  - invitations: tokens para invitar usuarios por email
-- =============================================================

create table if not exists public.teams (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text unique not null,
  owner_id           uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists teams_owner_idx on public.teams (owner_id);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'member',  -- owner | admin | member
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create index if not exists team_members_user_idx on public.team_members (user_id);
create index if not exists team_members_team_idx on public.team_members (team_id);

create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams (id) on delete cascade,
  email       text not null,
  token       text unique not null default gen_random_uuid()::text,
  role        text not null default 'member',
  invited_by  uuid not null references auth.users (id),
  expires_at  timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists invitations_team_idx on public.invitations (team_id);
create index if not exists invitations_email_idx on public.invitations (email);
create index if not exists invitations_token_idx on public.invitations (token);

-- Trigger updated_at
drop trigger if exists teams_touch_updated_at on public.teams;
create trigger teams_touch_updated_at
  before update on public.teams
  for each row execute function public.touch_updated_at();

-- =============================================================
--  RLS
-- =============================================================

alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.invitations enable row level security;

-- Teams: un usuario puede ver/eeditar equipos donde es miembro
drop policy if exists "teams_select_member" on public.teams;
create policy "teams_select_member"
  on public.teams for select to authenticated
  using (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = teams.id and tm.user_id = auth.uid()
    )
  );

drop policy if exists "teams_insert_owner" on public.teams;
create policy "teams_insert_owner"
  on public.teams for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "teams_update_owner_or_admin" on public.teams;
create policy "teams_update_owner_or_admin"
  on public.teams for update to authenticated
  using (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = teams.id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
  with check (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = teams.id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  );

-- Team members: visible para miembros del mismo equipo
drop policy if exists "team_members_select_team" on public.team_members;
create policy "team_members_select_team"
  on public.team_members for select to authenticated
  using (
    user_id = auth.uid()
    or exists(
      select 1 from public.team_members tm
      where tm.team_id = team_members.team_id and tm.user_id = auth.uid()
    )
  );

-- Solo owner/admin puede invitar miembros
drop policy if exists "team_members_insert_admin" on public.team_members;
create policy "team_members_insert_admin"
  on public.team_members for insert to authenticated
  with check (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = team_members.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  );

drop policy if exists "team_members_update_admin" on public.team_members;
create policy "team_members_update_admin"
  on public.team_members for update to authenticated
  using (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = team_members.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  );

drop policy if exists "team_members_delete_admin_or_self" on public.team_members;
create policy "team_members_delete_admin_or_self"
  on public.team_members for delete to authenticated
  using (
    user_id = auth.uid()
    or exists(
      select 1 from public.team_members tm
      where tm.team_id = team_members.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  );

-- Invitations: visibles para miembros del equipo
drop policy if exists "invitations_select_team" on public.invitations;
create policy "invitations_select_team"
  on public.invitations for select to authenticated
  using (
    email = (select email from public.profiles where id = auth.uid())
    or exists(
      select 1 from public.team_members tm
      where tm.team_id = invitations.team_id and tm.user_id = auth.uid()
    )
  );

drop policy if exists "invitations_insert_admin" on public.invitations;
create policy "invitations_insert_admin"
  on public.invitations for insert to authenticated
  with check (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = invitations.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  );

drop policy if exists "invitations_update_admin" on public.invitations;
create policy "invitations_update_admin"
  on public.invitations for update to authenticated
  using (
    email = (select email from public.profiles where id = auth.uid())
    or exists(
      select 1 from public.team_members tm
      where tm.team_id = invitations.team_id and tm.user_id = auth.uid()
    )
  );

-- =============================================================
--  Helpers
-- =============================================================

-- Crear equipo y hacer owner al creador automáticamente
create or replace function public.create_team(p_name text, p_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.teams (name, slug, owner_id)
  values (p_name, p_slug, v_user_id)
  returning id into v_team_id;

  insert into public.team_members (team_id, user_id, role)
  values (v_team_id, v_user_id, 'owner');

  return v_team_id;
end;
$$;

-- Aceptar invitación
create or replace function public.accept_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv record;
  v_user_email text;
begin
  select email from public.profiles where id = auth.uid() into v_user_email;

  select * into v_inv from public.invitations
  where token = p_token and accepted_at is null and expires_at > now();

  if not found then
    raise exception 'Invitation invalid or expired';
  end if;

  if v_inv.email != v_user_email then
    raise exception 'Email mismatch';
  end if;

  insert into public.team_members (team_id, user_id, role)
  values (v_inv.team_id, auth.uid(), v_inv.role)
  on conflict (team_id, user_id) do nothing;

  update public.invitations set accepted_at = now() where id = v_inv.id;

  return v_inv.team_id;
end;
$$;
