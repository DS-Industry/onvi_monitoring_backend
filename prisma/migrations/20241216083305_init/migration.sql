/*
  Warnings:

  - Added the required column `carryingAt` to the `WarehouseDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WarehouseDocument" ADD COLUMN     "carryingAt" TIMESTAMP(3) NOT NULL;
