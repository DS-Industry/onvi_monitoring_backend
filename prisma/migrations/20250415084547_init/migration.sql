/*
  Warnings:

  - Added the required column `organizationId` to the `HrWorker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrWorker" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HrWorker" ADD CONSTRAINT "HrWorker_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
