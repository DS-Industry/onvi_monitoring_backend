/*
  Warnings:

  - Changed the type of `bonus` on the `Benefit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_benefitActionTypeId_fkey";

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "bonus",
ADD COLUMN     "bonus" INTEGER NOT NULL,
ALTER COLUMN "benefitActionTypeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BenefitActionType" ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_benefitActionTypeId_fkey" FOREIGN KEY ("benefitActionTypeId") REFERENCES "BenefitActionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
