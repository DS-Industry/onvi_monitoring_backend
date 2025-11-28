-- CreateEnum
CREATE TYPE "ManagerPaperGroup" AS ENUM ('RENT', 'REVENUE', 'WAGES', 'INVESTMENT_DEVIDENTS', 'UTILITY_BILLS', 'TAXES', 'ACCOUNTABLE_FUNDS', 'REPRESENTATIVE_EXPENSES', 'SALE_EQUIPMENT', 'MANUFACTURE', 'OTHER', 'SUPPLIES', 'P_C', 'WAREHOUSE', 'CONSTRUCTION', 'MAINTENANCE_REPAIR', 'TRANSPORTATION_COSTS');

-- CreateEnum
CREATE TYPE "ManagerPaperTypeClass" AS ENUM ('RECEIPT', 'EXPENDITURE');

-- CreateEnum
CREATE TYPE "ManagerReportPeriodStatus" AS ENUM ('SAVE', 'SENT');

-- CreateTable
CREATE TABLE "ManagerPaper" (
    "id" SERIAL NOT NULL,
    "group" "ManagerPaperGroup" NOT NULL,
    "posId" INTEGER NOT NULL,
    "paperTypeId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "imageProductReceipt" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "ManagerPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerPaperType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ManagerPaperTypeClass" NOT NULL,

    CONSTRAINT "ManagerPaperType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerReportPeriod" (
    "id" SERIAL NOT NULL,
    "status" "ManagerReportPeriodStatus" NOT NULL,
    "startPeriod" TIMESTAMP(3) NOT NULL,
    "endPeriod" TIMESTAMP(3) NOT NULL,
    "sumStartPeriod" INTEGER NOT NULL,
    "sumEndPeriod" INTEGER NOT NULL,
    "shortage" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "ManagerReportPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_paperTypeId_fkey" FOREIGN KEY ("paperTypeId") REFERENCES "ManagerPaperType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerReportPeriod" ADD CONSTRAINT "ManagerReportPeriod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerReportPeriod" ADD CONSTRAINT "ManagerReportPeriod_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerReportPeriod" ADD CONSTRAINT "ManagerReportPeriod_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
