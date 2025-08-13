-- AlterTable
ALTER TABLE "HrPosition" ADD COLUMN     "organizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "HrPosition" ADD CONSTRAINT "HrPosition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
