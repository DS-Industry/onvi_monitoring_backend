/*
  Warnings:

  - You are about to drop the column `categoryId` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `InventoryItem` table. All the data in the column will be lost.
  - Added the required column `nomenclatureId` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_createdById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_supplierId_fkey";

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "categoryId",
DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "name",
DROP COLUMN "sku",
DROP COLUMN "supplierId",
ADD COLUMN     "nomenclatureId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Nomenclature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "supplierId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Nomenclature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nomenclature_sku_key" ON "Nomenclature"("sku");

-- AddForeignKey
ALTER TABLE "Nomenclature" ADD CONSTRAINT "Nomenclature_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomenclature" ADD CONSTRAINT "Nomenclature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomenclature" ADD CONSTRAINT "Nomenclature_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomenclature" ADD CONSTRAINT "Nomenclature_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
