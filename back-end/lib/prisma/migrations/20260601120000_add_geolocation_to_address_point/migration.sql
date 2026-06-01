ALTER TABLE "address_point"
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;

ALTER TABLE "address_point"
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

UPDATE "address_point"
SET
    "latitude" = COALESCE("latitude", 0),
    "longitude" = COALESCE("longitude", 0);

ALTER TABLE "address_point"
ALTER COLUMN "latitude" SET NOT NULL;

ALTER TABLE "address_point"
ALTER COLUMN "longitude" SET NOT NULL;
