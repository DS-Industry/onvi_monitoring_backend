-- CreateEnum
CREATE TYPE "TechConsumablesType" AS ENUM ('SPARE_EQUIPMENT', 'BRUSH', 'TPOWER', 'SOAP', 'WAX', 'PRESOAK', 'TIRE', 'SALT');

-- CreateEnum
CREATE TYPE "TechExpenseReportStatus" AS ENUM ('CREATED', 'SAVED', 'SENT');

-- CreateTable
CREATE TABLE "TechConsumables" (
    "id" SERIAL NOT NULL,
    "nomenclatureId" INTEGER NOT NULL,
    "posId" INTEGER NOT NULL,
    "type" "TechConsumablesType" NOT NULL,

    CONSTRAINT "TechConsumables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechExpenseReport" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,
    "startPeriod" TIMESTAMP(3) NOT NULL,
    "endPeriod" TIMESTAMP(3) NOT NULL,
    "status" "TechExpenseReportStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "TechExpenseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechExpenseReportItem" (
    "id" SERIAL NOT NULL,
    "techConsumablesId" INTEGER NOT NULL,
    "techExpenseReportId" INTEGER NOT NULL,
    "quantityAtStart" INTEGER NOT NULL,
    "quantityByReport" INTEGER NOT NULL,
    "quantityOnWarehouse" INTEGER NOT NULL,
    "quantityWriteOff" INTEGER,
    "quantityAtEnd" INTEGER,

    CONSTRAINT "TechExpenseReportItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TechConsumables" ADD CONSTRAINT "TechConsumables_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechConsumables" ADD CONSTRAINT "TechConsumables_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechExpenseReport" ADD CONSTRAINT "TechExpenseReport_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechExpenseReport" ADD CONSTRAINT "TechExpenseReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechExpenseReport" ADD CONSTRAINT "TechExpenseReport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechExpenseReportItem" ADD CONSTRAINT "TechExpenseReportItem_techConsumablesId_fkey" FOREIGN KEY ("techConsumablesId") REFERENCES "TechConsumables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechExpenseReportItem" ADD CONSTRAINT "TechExpenseReportItem_techExpenseReportId_fkey" FOREIGN KEY ("techExpenseReportId") REFERENCES "TechExpenseReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
