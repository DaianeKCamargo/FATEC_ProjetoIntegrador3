-- Migration: add rejection_reason to point_collections
ALTER TABLE point_collections ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
