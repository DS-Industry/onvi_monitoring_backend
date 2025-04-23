/*
  Warnings:

  - You are about to drop the column `countCarCard` on the `CashCollection` table. All the data in the column will be lost.
  - Added the required column `carCount` to the `CashCollectionDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sumCard` to the `CashCollectionDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashCollection" DROP COLUMN "countCarCard";

-- AlterTable
ALTER TABLE "CashCollectionDevice" ADD COLUMN     "carCount" INTEGER NOT NULL,
ADD COLUMN     "sumCard" INTEGER NOT NULL;
