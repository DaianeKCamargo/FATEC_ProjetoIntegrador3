-- CreateEnum
CREATE TYPE "PointCollectionStatus" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO');

-- CreateTable
CREATE TABLE "adress_point" (
    "id_adress" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adress_point_pkey" PRIMARY KEY ("id_adress")
);

-- CreateTable
CREATE TABLE "point_collection" (
    "id_pc" SERIAL NOT NULL,
    "opens_pc" BOOLEAN NOT NULL DEFAULT false,
    "name_user" TEXT NOT NULL,
    "link_photo" TEXT NOT NULL,
    "cpf_user" TEXT NOT NULL,
    "cpnj_point" TEXT NOT NULL,
    "email_user" TEXT NOT NULL,
    "cel_user" TEXT NOT NULL,
    "name_point" TEXT NOT NULL,
    "hour_init" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "status" "PointCollectionStatus" NOT NULL DEFAULT 'PENDENTE',
    "review_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "approved_point_id" INTEGER,
    "id_adress" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_collection_pkey" PRIMARY KEY ("id_pc")
);

-- CreateTable
CREATE TABLE "point_collection_approved" (
    "id_pc_approved" SERIAL NOT NULL,
    "opens_pc" BOOLEAN NOT NULL DEFAULT false,
    "name_user" TEXT NOT NULL,
    "link_photo" TEXT NOT NULL,
    "cpf_user" TEXT NOT NULL,
    "cpnj_point" TEXT NOT NULL,
    "email_user" TEXT NOT NULL,
    "cel_user" TEXT NOT NULL,
    "name_point" TEXT NOT NULL,
    "hour_init" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_adress" INTEGER NOT NULL,

    CONSTRAINT "point_collection_approved_pkey" PRIMARY KEY ("id_pc_approved")
);

-- CreateIndex
CREATE UNIQUE INDEX "point_collection_approved_point_id_key" ON "point_collection"("approved_point_id");

-- CreateIndex
CREATE INDEX "point_collection_status_idx" ON "point_collection"("status");

-- CreateIndex
CREATE INDEX "point_collection_id_adress_idx" ON "point_collection"("id_adress");

-- CreateIndex
CREATE INDEX "point_collection_approved_id_adress_idx" ON "point_collection_approved"("id_adress");

-- AddForeignKey
ALTER TABLE "point_collection" ADD CONSTRAINT "point_collection_id_adress_fkey" FOREIGN KEY ("id_adress") REFERENCES "adress_point"("id_adress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_collection" ADD CONSTRAINT "point_collection_approved_point_id_fkey" FOREIGN KEY ("approved_point_id") REFERENCES "point_collection_approved"("id_pc_approved") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_collection_approved" ADD CONSTRAINT "point_collection_approved_id_adress_fkey" FOREIGN KEY ("id_adress") REFERENCES "adress_point"("id_adress") ON DELETE RESTRICT ON UPDATE CASCADE;
