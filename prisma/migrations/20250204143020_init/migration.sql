/*
  Warnings:

  - You are about to drop the column `cashCallectionDate` on the `CashCollection` table. All the data in the column will be lost.
  - Added the required column `cashCollectionDate` to the `CashCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashCollection" DROP COLUMN "cashCallectionDate",
ADD COLUMN     "cashCollectionDate" TIMESTAMP(3) NOT NULL;
