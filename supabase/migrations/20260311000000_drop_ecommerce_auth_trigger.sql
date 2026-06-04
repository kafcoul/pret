-- ═══════════════════════════════════════════════════════════════
-- Migration : Suppression du trigger e-commerce sur auth.users
-- ═══════════════════════════════════════════════════════════════
-- Le trigger on_auth_user_created + handle_new_user() référençait
-- les tables public.profiles et public.user_roles de l'ancien
-- projet e-commerce. Ces tables ayant été supprimées (migration
-- 20260224000002), toute création de compte Supabase Auth échouait
-- avec "Database error saving new user".
-- ═══════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
