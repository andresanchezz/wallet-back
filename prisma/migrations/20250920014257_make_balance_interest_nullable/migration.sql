/*
  Warnings:

  - Made the column `annual_interest` on table `wallets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `current_balance` on table `wallets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_interest_earned` on table `wallets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."wallets" ALTER COLUMN "annual_interest" SET NOT NULL,
ALTER COLUMN "annual_interest" SET DEFAULT 0,
ALTER COLUMN "current_balance" SET NOT NULL,
ALTER COLUMN "total_interest_earned" SET NOT NULL;
