/*
  Warnings:

  - Added the required column `oldTookMoneyTime` to the `CashCollectionDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashCollectionDevice" ADD COLUMN     "oldTookMoneyTime" TIMESTAMP(3) NOT NULL;
