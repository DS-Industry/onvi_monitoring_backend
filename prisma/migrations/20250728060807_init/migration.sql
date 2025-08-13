/*
  Warnings:

  - You are about to drop the `ShiftReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkDayShiftReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShiftReportCashOper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShiftReportToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftReport" DROP CONSTRAINT "ShiftReport_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ShiftReport" DROP CONSTRAINT "ShiftReport_posId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftReport" DROP CONSTRAINT "ShiftReport_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "WorkDayShiftReport" DROP CONSTRAINT "WorkDayShiftReport_createdById_fkey";

-- DropForeignKey
ALTER TABLE "WorkDayShiftReport" DROP CONSTRAINT "WorkDayShiftReport_shiftReportId_fkey";

-- DropForeignKey
ALTER TABLE "WorkDayShiftReport" DROP CONSTRAINT "WorkDayShiftReport_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "WorkDayShiftReport" DROP CONSTRAINT "WorkDayShiftReport_workerId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftReportCashOper" DROP CONSTRAINT "WorkDayShiftReportCashOper_carWashDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftReportCashOper" DROP CONSTRAINT "WorkDayShiftReportCashOper_workDayShiftReportId_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftReportToUser" DROP CONSTRAINT "_ShiftReportToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftReportToUser" DROP CONSTRAINT "_ShiftReportToUser_B_fkey";

-- DropTable
DROP TABLE "ShiftReport";

-- DropTable
DROP TABLE "WorkDayShiftReport";

-- DropTable
DROP TABLE "ShiftReportCashOper";

-- DropTable
DROP TABLE "_ShiftReportToUser";

-- CreateTable
CREATE TABLE "MNGShiftReport" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER,
    "workerId" INTEGER,
    "workDate" TIMESTAMP(3) NOT NULL,
    "typeWorkDay" "TypeWorkDay" NOT NULL,
    "timeWorkedOut" TEXT,
    "startWorkingTime" TIMESTAMP(3),
    "endWorkingTime" TIMESTAMP(3),
    "estimation" "TypeEstimation",
    "status" "StatusWorkDayShiftReport",
    "cashAtStart" INTEGER,
    "cashAtEnd" INTEGER,
    "prize" INTEGER,
    "fine" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "MNGShiftReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNGShiftReportCashOper" (
    "id" SERIAL NOT NULL,
    "shiftReportId" INTEGER,
    "carWashDeviceId" INTEGER,
    "eventDate" TIMESTAMP(3),
    "type" "TypeWorkDayShiftReportCashOper" NOT NULL,
    "sum" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "MNGShiftReportCashOper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HrWorkerToPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HrWorkerToPos_AB_unique" ON "_HrWorkerToPos"("A", "B");

-- CreateIndex
CREATE INDEX "_HrWorkerToPos_B_index" ON "_HrWorkerToPos"("B");

-- AddForeignKey
ALTER TABLE "MNGShiftReport" ADD CONSTRAINT "MNGShiftReport_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftReport" ADD CONSTRAINT "MNGShiftReport_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "HrWorker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftReport" ADD CONSTRAINT "MNGShiftReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftReport" ADD CONSTRAINT "MNGShiftReport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftReportCashOper" ADD CONSTRAINT "MNGShiftReportCashOper_shiftReportId_fkey" FOREIGN KEY ("shiftReportId") REFERENCES "MNGShiftReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftReportCashOper" ADD CONSTRAINT "MNGShiftReportCashOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HrWorkerToPos" ADD CONSTRAINT "_HrWorkerToPos_A_fkey" FOREIGN KEY ("A") REFERENCES "HrWorker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HrWorkerToPos" ADD CONSTRAINT "_HrWorkerToPos_B_fkey" FOREIGN KEY ("B") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
