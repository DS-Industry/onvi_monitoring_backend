-- CreateEnum
CREATE TYPE "WarehouseDocumentType" AS ENUM ('WRITEOFF', 'INVENTORY', 'COMMISSIONING', 'RECEIPT', 'MOVING');

-- CreateTable
CREATE TABLE "WarehouseDocument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "warehouseDocumentType" "WarehouseDocumentType" NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updateById" INTEGER NOT NULL,

    CONSTRAINT "WarehouseDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseDocumentDetail" (
    "id" SERIAL NOT NULL,
    "warehouseDocumentId" INTEGER NOT NULL,
    "nomenclatureId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "metaData" JSONB NOT NULL,

    CONSTRAINT "WarehouseDocumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseDocumentDetailItem" (
    "id" SERIAL NOT NULL,
    "warehouseDocumentType" "WarehouseDocumentType" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WarehouseDocumentDetailItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseDocument" ADD CONSTRAINT "WarehouseDocument_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseDocumentDetail" ADD CONSTRAINT "WarehouseDocumentDetail_warehouseDocumentId_fkey" FOREIGN KEY ("warehouseDocumentId") REFERENCES "WarehouseDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseDocumentDetail" ADD CONSTRAINT "WarehouseDocumentDetail_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
