-- AlterTable
ALTER TABLE "LTYProgram" ADD COLUMN     "ownerOrganizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "LTYProgram" ADD CONSTRAINT "LTYProgram_ownerOrganizationId_fkey" FOREIGN KEY ("ownerOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
