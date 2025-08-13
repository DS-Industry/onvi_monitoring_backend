/*
  Warnings:

  - You are about to drop the column `lifetimeDays` on the `CardBonusOperType` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `LoyaltyProgram` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoyaltyProgram" DROP CONSTRAINT "LoyaltyProgram_organizationId_fkey";

-- DropIndex
DROP INDEX "LoyaltyProgram_organizationId_key";

-- AlterTable
ALTER TABLE "CardBonusOperType" DROP COLUMN "lifetimeDays";

-- AlterTable
ALTER TABLE "LoyaltyProgram" DROP COLUMN "organizationId",
ADD COLUMN     "lifetimeBonusDays" INTEGER;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "loyaltyProgramId" INTEGER;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
