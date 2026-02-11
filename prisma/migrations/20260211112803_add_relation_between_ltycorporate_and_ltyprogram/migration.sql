-- AlterTable
ALTER TABLE "LTYCorporate" ADD COLUMN     "ltyProgramId" INTEGER;

-- AddForeignKey
ALTER TABLE "LTYCorporate" ADD CONSTRAINT "LTYCorporate_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
