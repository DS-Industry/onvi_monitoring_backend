-- DropForeignKey
ALTER TABLE "WarehouseDocument" DROP CONSTRAINT "WarehouseDocument_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseDocument" DROP CONSTRAINT "WarehouseDocument_warehouseId_fkey";

-- AlterTable
ALTER TABLE "WarehouseDocument" ALTER COLUMN "warehouseId" DROP NOT NULL,
ALTER COLUMN "responsibleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
