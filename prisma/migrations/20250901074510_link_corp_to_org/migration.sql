-- CreateEnum
CREATE TYPE "LTYCorporateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "LTYCorporate" ADD COLUMN     "organizationId" INTEGER,
ADD COLUMN     "status" "LTYCorporateStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "LTYCorporate" ADD CONSTRAINT "LTYCorporate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
