-- AlterTable
ALTER TABLE "HrWorker" ADD COLUMN     "placementId" INTEGER;

-- AddForeignKey
ALTER TABLE "HrWorker" ADD CONSTRAINT "HrWorker_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
