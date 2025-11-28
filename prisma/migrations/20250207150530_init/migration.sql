/*
  Warnings:

  - Added the required column `oldCashCollectionDate` to the `CashCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashCollection" ADD COLUMN     "oldCashCollectionDate" TIMESTAMP(3) NOT NULL;
