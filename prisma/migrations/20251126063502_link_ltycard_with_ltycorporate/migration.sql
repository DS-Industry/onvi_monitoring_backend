-- AlterTable
ALTER TABLE "LTYCard" ADD COLUMN     "corporateId" INTEGER;

-- AddForeignKey
ALTER TABLE "LTYCard" ADD CONSTRAINT "LTYCard_corporateId_fkey" FOREIGN KEY ("corporateId") REFERENCES "LTYCorporate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
