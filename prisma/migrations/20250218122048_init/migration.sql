-- AlterTable
ALTER TABLE "WorkDayShiftReportCashOper" ADD COLUMN     "carWashDeviceId" INTEGER,
ADD COLUMN     "eventDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "WorkDayShiftReportCashOper" ADD CONSTRAINT "WorkDayShiftReportCashOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
