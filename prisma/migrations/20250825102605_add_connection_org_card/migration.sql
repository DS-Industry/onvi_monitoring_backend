-- AlterTable
ALTER TABLE "LTYCard" ADD COLUMN     "organizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "LTYCard" ADD CONSTRAINT "LTYCard_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
