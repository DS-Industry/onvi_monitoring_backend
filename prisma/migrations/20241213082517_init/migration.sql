/*
  Warnings:

  - Added the required column `responsibleId` to the `WarehouseDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WarehouseDocument" ADD COLUMN     "responsibleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WarehouseDocumentDetail" ADD COLUMN     "comment" TEXT;

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
