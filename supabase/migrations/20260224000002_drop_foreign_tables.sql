-- ═══════════════════════════════════════════════════════════
-- Migration : Suppression des tables étrangères (projet e-commerce)
-- ═══════════════════════════════════════════════════════════
-- Ces tables ne font pas partie de Solutions Financement Fortier.
-- Elles proviennent probablement d'un autre projet sur le même
-- projet Supabase.
--
-- ⚠️  ATTENTION : Vérifiez sur le dashboard Supabase qu'aucune
-- autre application n'utilise ces tables avant d'exécuter.
-- ═══════════════════════════════════════════════════════════

-- Vues en premier (elles dépendent des tables)
DROP VIEW IF EXISTS public.vw_analytics_daily CASCADE;
DROP VIEW IF EXISTS public.vw_conversion_funnel CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.vw_daily_stock_snapshot CASCADE;
DROP VIEW IF EXISTS public.vw_slow_queries CASCADE;
DROP VIEW IF EXISTS public.vw_top_searches CASCADE;

-- Tables avec dépendances (ordre inversé des foreign keys)
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.inventory_logs CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
