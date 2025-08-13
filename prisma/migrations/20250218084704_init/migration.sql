-- CreateEnum
CREATE TYPE "TypeWorkDayShiftReportCashOper" AS ENUM ('REFUND', 'REPLENISHMENT');

-- CreateTable
CREATE TABLE "ShiftReportCashOper" (
    "id" SERIAL NOT NULL,
    "workDayShiftReportId" INTEGER,
    "type" "TypeWorkDayShiftReportCashOper" NOT NULL,
    "sum" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "WorkDayShiftReportCashOper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftReportCashOper" ADD CONSTRAINT "WorkDayShiftReportCashOper_workDayShiftReportId_fkey" FOREIGN KEY ("workDayShiftReportId") REFERENCES "WorkDayShiftReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
