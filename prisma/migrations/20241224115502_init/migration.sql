-- CreateEnum
CREATE TYPE "WarehouseDocumentStatus" AS ENUM ('CREATED', 'SAVED', 'SENT');

-- AlterTable
ALTER TABLE "WarehouseDocument" ADD COLUMN     "status" "WarehouseDocumentStatus";
