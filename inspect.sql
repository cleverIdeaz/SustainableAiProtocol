-- ============================================================
-- SAP DB INSPECTION — paste into Supabase SQL Editor
-- Run each block separately or all at once
-- ============================================================

-- 1. All public tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. global_stats column shape
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'global_stats' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. global_stats current data
SELECT * FROM global_stats;

-- 4. SAP-prefixed tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'sap_%';

-- 5. sap_daily_stats column shape (if exists)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sap_daily_stats' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. sap_hourly_stats column shape (if exists)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sap_hourly_stats' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. sap_user_sessions column shape (if exists)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sap_user_sessions' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Legacy tables from earliest migration (if they survived)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('prompts', 'user_stats');

-- 9. StyleTree tables (confirm migration was applied)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'styletree_%';

-- 10. RLS status on SAP tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('global_stats', 'sap_daily_stats', 'sap_hourly_stats', 'sap_user_sessions', 'sap_events');
