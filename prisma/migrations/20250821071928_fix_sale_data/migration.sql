/*
  Warnings:

  - Added the required column `name` to the `MNGSaleDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ManagerPaperGroup" ADD VALUE 'SALE_NOMENCLATURE';

-- AlterTable
ALTER TABLE "MNGSaleDocument" ADD COLUMN     "name" TEXT NOT NULL;
