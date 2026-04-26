-- CreateTable
CREATE TABLE "relatorio_animais" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "tipo_animal" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorio_animais_pkey" PRIMARY KEY ("id")
);
