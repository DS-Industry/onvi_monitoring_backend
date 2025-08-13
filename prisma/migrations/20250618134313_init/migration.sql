-- DropForeignKey
ALTER TABLE "ManagerReportPeriod" DROP CONSTRAINT "ManagerReportPeriod_createdById_fkey";

-- AlterTable
ALTER TABLE "ManagerReportPeriod" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ManagerReportPeriod" ADD CONSTRAINT "ManagerReportPeriod_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
