-- AlterTable
ALTER TABLE "ShiftReportCashOper" ADD COLUMN     "carWashDeviceId" INTEGER,
ADD COLUMN     "eventDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ShiftReportCashOper" ADD CONSTRAINT "WorkDayShiftReportCashOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
