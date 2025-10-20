-- AlterTable
ALTER TABLE "LTYBenefit" ADD COLUMN     "ltyProgramId" INTEGER;

-- AddForeignKey
ALTER TABLE "LTYBenefit" ADD CONSTRAINT "LTYBenefit_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
