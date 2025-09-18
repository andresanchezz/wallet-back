-- CreateEnum
CREATE TYPE "public"."TransactionDirection" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "direction" "public"."TransactionDirection";
