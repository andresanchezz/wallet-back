/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "icon" TEXT DEFAULT 'MdCategory';

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "public"."users"("name");
