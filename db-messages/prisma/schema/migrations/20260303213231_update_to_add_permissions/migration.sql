/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ALTER COLUMN "teams" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "role",
ADD COLUMN     "role" TEXT;

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
