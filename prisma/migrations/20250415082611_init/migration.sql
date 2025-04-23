/*
  Warnings:

  - Made the column `placementId` on table `HrWorker` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HrWorker" DROP CONSTRAINT "HrWorker_placementId_fkey";

-- AlterTable
ALTER TABLE "HrWorker" ALTER COLUMN "placementId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "HrWorker" ADD CONSTRAINT "HrWorker_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
