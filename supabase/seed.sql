-- =============================================================
--  Seed data — usuarios demo para screenshots y pruebas
-- =============================================================
--  ⚠️  SOLO EJECUTAR EN PROYECTO DE DESARROLLO.
--  En producción, este archivo NO se debe ejecutar.
--
--  Crea 6 usuarios demo con roles variados:
--  - 1 admin (tú)
--  - 1 premium (con suscripción Pro activa)
--  - 1 premium (con suscripción Enterprise)
--  - 2 free
--  - 1 con payment_failed (para mostrar dunning)
--
--  Requiere: haber ejecutado profiles.sql + subscriptions.sql primero.
-- =============================================================

-- Para crear estos usuarios en auth.users, necesitas hacerlo vía
-- Supabase Dashboard → Authentication → Users → "Add user".
-- Aquí solo creamos los profiles + subscriptions con UUIDs de ejemplo.
-- REEMPLAZA los UUIDs por los reales de tu proyecto.

-- =====================================================
--  EJEMPLO — Reemplaza los UUIDs antes de ejecutar
-- =====================================================

-- Admin (tú)
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'diego@di3go04.dev',
  'Diego Admin',
  'diego',
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego'
) ON CONFLICT (id) DO NOTHING;

-- Usuario premium Pro
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'ana@demo.com',
  'Ana García',
  'anagarcia',
  'premium',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
) ON CONFLICT (id) DO NOTHING;

-- Usuario premium Enterprise
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'carlos@empresa.com',
  'Carlos Mendoza',
  'carlosme',
  'premium',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
) ON CONFLICT (id) DO NOTHING;

-- Usuario free #1
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'sarah@pixelcraft.io',
  'Sarah Chen',
  'sarahc',
  'free',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
) ON CONFLICT (id) DO NOTHING;

-- Usuario free #2
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'anna@taskflow.app',
  'Anna Schmidt',
  'annas',
  'free',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=AnnaS'
) ON CONFLICT (id) DO NOTHING;

-- Usuario con payment failed (dunning)
INSERT INTO public.profiles (id, email, full_name, username, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'diego.f@demo.com',
  'Diego Fernández',
  'diegof',
  'free',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=DiegoF'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
--  Subscriptions
-- =====================================================

INSERT INTO public.subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status, plan, current_period_end)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'cus_demo_ana',    'sub_demo_ana',    'active',   'pro',        now() + interval '28 days'),
  ('00000000-0000-0000-0000-000000000003', 'cus_demo_carlos', 'sub_demo_carlos', 'active',   'enterprise', now() + interval '20 days'),
  ('00000000-0000-0000-0000-000000000006', 'cus_demo_diegoF', 'sub_demo_diegoF', 'past_due', 'pro',        now() - interval '2 days')
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
--  Team de demo (Pixelcraft Studio)
-- =====================================================

INSERT INTO public.teams (id, name, slug, owner_id)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Pixelcraft Studio',
  'pixelcraft',
  '00000000-0000-0000-0000-000000000003'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'owner'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'admin'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member')
ON CONFLICT (team_id, user_id) DO NOTHING;

-- =====================================================
--  Audit logs de demo
-- =====================================================

INSERT INTO public.audit_logs (actor_id, action, target_id, target_type, metadata)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'role.change', '00000000-0000-0000-0000-000000000002', 'user', '{"new_role":"premium"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'role.change', '00000000-0000-0000-0000-000000000003', 'user', '{"new_role":"premium"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'user.ban', null, 'user', '{"reason":"spam"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
