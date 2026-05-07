-- Ajuste seguro para o enum existente.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = 'PointCollectionStatus'
          AND e.enumlabel = 'RECUSADO'
    ) THEN
        ALTER TYPE "PointCollectionStatus" RENAME VALUE 'RECUSADO' TO 'REJEITADO';
    END IF;
END$$;

-- CreateTable
CREATE TABLE "point_collections" (
    "id_pc" SERIAL NOT NULL,
    "status" "PointCollectionStatus" NOT NULL DEFAULT 'PENDENTE',
    "name_user" TEXT NOT NULL,
    "cpf_user" TEXT NOT NULL,
    "cel_user" TEXT NOT NULL,
    "email_user" TEXT NOT NULL,
    "link_photo" TEXT NOT NULL,
    "name_point" TEXT NOT NULL,
    "cnpj_point" TEXT NOT NULL,
    "opens_day" TEXT NOT NULL,
    "hour_init" TEXT NOT NULL,
    "hour_final" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_collections_pkey" PRIMARY KEY ("id_pc")
);

-- CreateTable
CREATE TABLE "address_point" (
    "id_address" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "fk_point_collections" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_point_pkey" PRIMARY KEY ("id_address")
);

-- CreateIndex
CREATE UNIQUE INDEX "point_collections_cpf_user_key" ON "point_collections"("cpf_user");

-- CreateIndex
CREATE UNIQUE INDEX "point_collections_cnpj_point_key" ON "point_collections"("cnpj_point");

-- CreateIndex
CREATE INDEX "point_collections_status_idx" ON "point_collections"("status");

-- CreateIndex
CREATE INDEX "point_collections_name_point_idx" ON "point_collections"("name_point");

-- CreateIndex
CREATE UNIQUE INDEX "address_point_fk_point_collections_key" ON "address_point"("fk_point_collections");

-- CreateIndex
CREATE INDEX "address_point_city_idx" ON "address_point"("city");

-- AddForeignKey
ALTER TABLE "address_point" ADD CONSTRAINT "address_point_fk_point_collections_fkey" FOREIGN KEY ("fk_point_collections") REFERENCES "point_collections"("id_pc") ON DELETE CASCADE ON UPDATE CASCADE;
