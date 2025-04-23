/*
  Warnings:

  - You are about to drop the column `benefitTypeId` on the `Benefit` table. All the data in the column will be lost.
  - You are about to drop the column `posBenefitId` on the `Benefit` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyCardId` on the `MobileUser` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyProgramId` on the `Pos` table. All the data in the column will be lost.
  - You are about to drop the `BenefitType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoyaltyCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PosBenefit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `limitBenefit` to the `LoyaltyCardTier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_benefitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_posBenefitId_fkey";

-- DropForeignKey
ALTER TABLE "BenefitType" DROP CONSTRAINT "BenefitType_posBenefitId_fkey";

-- DropForeignKey
ALTER TABLE "LoyaltyCard" DROP CONSTRAINT "LoyaltyCard_loyaltyCardTierId_fkey";

-- DropForeignKey
ALTER TABLE "MobileUser" DROP CONSTRAINT "MobileUser_loyaltyCardId_fkey";

-- DropForeignKey
ALTER TABLE "Pos" DROP CONSTRAINT "Pos_loyaltyProgramId_fkey";

-- DropForeignKey
ALTER TABLE "PosBenefit" DROP CONSTRAINT "PosBenefit_posId_fkey";

-- DropIndex
DROP INDEX "MobileUser_loyaltyCardId_key";

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "benefitTypeId",
DROP COLUMN "posBenefitId";

-- AlterTable
ALTER TABLE "CardMobileUser" ADD COLUMN     "loyaltyCardTierId" INTEGER;

-- AlterTable
ALTER TABLE "LoyaltyCardTier" ADD COLUMN     "limitBenefit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MobileUser" DROP COLUMN "loyaltyCardId";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "loyaltyProgramId" INTEGER;

-- AlterTable
ALTER TABLE "Pos" DROP COLUMN "loyaltyProgramId";

-- DropTable
DROP TABLE "BenefitType";

-- DropTable
DROP TABLE "LoyaltyCard";

-- DropTable
DROP TABLE "PosBenefit";

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMobileUser" ADD CONSTRAINT "CardMobileUser_loyaltyCardTierId_fkey" FOREIGN KEY ("loyaltyCardTierId") REFERENCES "LoyaltyCardTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
