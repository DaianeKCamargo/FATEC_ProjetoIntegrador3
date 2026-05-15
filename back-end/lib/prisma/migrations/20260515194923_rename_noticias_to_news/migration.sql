/*
  Warnings:

  - You are about to drop the `adress_point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credenciais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `noticias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point_collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point_collection_approved` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `relatorio_animais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `relatorio_tampinhas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "point_collection" DROP CONSTRAINT "point_collection_approved_point_id_fkey";

-- DropForeignKey
ALTER TABLE "point_collection" DROP CONSTRAINT "point_collection_id_adress_fkey";

-- DropForeignKey
ALTER TABLE "point_collection_approved" DROP CONSTRAINT "point_collection_approved_id_adress_fkey";

-- DropTable
DROP TABLE "adress_point";

-- DropTable
DROP TABLE "credenciais";

-- DropTable
DROP TABLE "noticias";

-- DropTable
DROP TABLE "point_collection";

-- DropTable
DROP TABLE "point_collection_approved";

-- DropTable
DROP TABLE "relatorio_animais";

-- DropTable
DROP TABLE "relatorio_tampinhas";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals-registration" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "tipo_animal" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals-registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caps-registration" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "quantidade_kg" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caps-registration_pkey" PRIMARY KEY ("id")
);
