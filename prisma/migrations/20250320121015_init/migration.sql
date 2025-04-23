/*
  Warnings:

  - You are about to drop the column `benefitType` on the `Benefit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "benefitType";

-- DropEnum
DROP TYPE "BenefitType";
