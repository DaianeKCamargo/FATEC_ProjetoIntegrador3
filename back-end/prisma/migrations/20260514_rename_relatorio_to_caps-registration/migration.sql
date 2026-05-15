-- Migration: Rename table relatorio_tampinhas -> "caps-registration"
-- Generated: 2026-05-14

BEGIN;

-- Rename table
ALTER TABLE "relatorio_tampinhas" RENAME TO "caps-registration";

-- Rename serial sequence if exists (Postgres default naming)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'relatorio_tampinhas_id_seq') THEN
    ALTER SEQUENCE "relatorio_tampinhas_id_seq" RENAME TO "caps-registration_id_seq";
  END IF;
END$$;

-- Ensure sequence ownership (if sequence exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'caps-registration_id_seq') THEN
    ALTER SEQUENCE "caps-registration_id_seq" OWNED BY "caps-registration".id;
  END IF;
END$$;

-- Rename primary key index if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind IN ('i','I') AND relname = 'relatorio_tampinhas_pkey') THEN
    ALTER INDEX "relatorio_tampinhas_pkey" RENAME TO "caps-registration_pkey";
  END IF;
END$$;

COMMIT;
