-- CreateTable
CREATE TABLE "admin_user" (
    "id_admin" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "pass_hash" TEXT NOT NULL,
    "email_user" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id_admin")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_username_key" ON "admin_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_email_user_key" ON "admin_user"("email_user");
