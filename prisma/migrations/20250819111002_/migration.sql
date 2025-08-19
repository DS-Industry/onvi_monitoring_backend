-- CreateEnum
CREATE TYPE "DestinyNomenclature" AS ENUM ('INTERNAL', 'SALE');

-- AlterTable
ALTER TABLE "Nomenclature" ADD COLUMN     "destiny" "DestinyNomenclature" NOT NULL DEFAULT 'INTERNAL';

-- CreateTable
CREATE TABLE "MNGSalePrice" (
    "id" SERIAL NOT NULL,
    "nomenclatureId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "MNGSalePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNGSaleDocument" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "responsibleManagerId" INTEGER NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "MNGSaleDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNGSaleItem" (
    "id" SERIAL NOT NULL,
    "nomenclatureId" INTEGER NOT NULL,
    "mngSaleDocumentId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "MNGSaleItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MNGSalePrice" ADD CONSTRAINT "MNGSalePrice_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSalePrice" ADD CONSTRAINT "MNGSalePrice_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleDocument" ADD CONSTRAINT "MNGSaleDocument_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleDocument" ADD CONSTRAINT "MNGSaleDocument_responsibleManagerId_fkey" FOREIGN KEY ("responsibleManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleDocument" ADD CONSTRAINT "MNGSaleDocument_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleDocument" ADD CONSTRAINT "MNGSaleDocument_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleItem" ADD CONSTRAINT "MNGSaleItem_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGSaleItem" ADD CONSTRAINT "MNGSaleItem_mngSaleDocumentId_fkey" FOREIGN KEY ("mngSaleDocumentId") REFERENCES "MNGSaleDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
