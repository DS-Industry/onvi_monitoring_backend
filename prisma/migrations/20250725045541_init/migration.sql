/*
  Warnings:

  - The `benefitType` column on the `LTYBenefit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `loyaltyProgramId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `mobileUserId` on the `PromocodeTransaction` table. All the data in the column will be lost.
  - You are about to drop the `Benefit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BenefitActionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardBonusBank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardBonusOper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardBonusOperType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardMobileUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LTYdBonusOper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoyaltyCardTier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoyaltyProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MobileUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderMobileUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BenefitToLoyaltyCardTier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LoyaltyProgramToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MobileUserToUserTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LTYBenefitType" AS ENUM ('CASHBACK', 'DISCOUNT', 'GIFT_POINTS');

-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_benefitActionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusBank" DROP CONSTRAINT "CardBonusBank_cardMobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusOper" DROP CONSTRAINT "CardBonusOper_carWashDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusOper" DROP CONSTRAINT "CardBonusOper_cardMobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusOper" DROP CONSTRAINT "CardBonusOper_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusOper" DROP CONSTRAINT "CardBonusOper_orderMobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "CardBonusOper" DROP CONSTRAINT "CardBonusOper_typeOperId_fkey";

-- DropForeignKey
ALTER TABLE "CardMobileUser" DROP CONSTRAINT "CardMobileUser_loyaltyCardTierId_fkey";

-- DropForeignKey
ALTER TABLE "CardMobileUser" DROP CONSTRAINT "CardMobileUser_mobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "LTYdBonusOper" DROP CONSTRAINT "LTYdBonusOper_carWashDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "LTYdBonusOper" DROP CONSTRAINT "LTYdBonusOper_cardId_fkey";

-- DropForeignKey
ALTER TABLE "LTYdBonusOper" DROP CONSTRAINT "LTYdBonusOper_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "LTYdBonusOper" DROP CONSTRAINT "LTYdBonusOper_orderId_fkey";

-- DropForeignKey
ALTER TABLE "LTYdBonusOper" DROP CONSTRAINT "LTYdBonusOper_typeOperId_fkey";

-- DropForeignKey
ALTER TABLE "LoyaltyCardTier" DROP CONSTRAINT "LoyaltyCardTier_loyaltyProgramId_fkey";

-- DropForeignKey
ALTER TABLE "MobileUser" DROP CONSTRAINT "MobileUser_mobileUserRoleId_fkey";

-- DropForeignKey
ALTER TABLE "MobileUser" DROP CONSTRAINT "MobileUser_placementId_fkey";

-- DropForeignKey
ALTER TABLE "OrderMobileUser" DROP CONSTRAINT "OrderMobileUser_carWashDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "OrderMobileUser" DROP CONSTRAINT "OrderMobileUser_cardMobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_loyaltyProgramId_fkey";

-- DropForeignKey
ALTER TABLE "PromocodeTransaction" DROP CONSTRAINT "PromocodeTransaction_mobileUserId_fkey";

-- DropForeignKey
ALTER TABLE "_BenefitToLoyaltyCardTier" DROP CONSTRAINT "_BenefitToLoyaltyCardTier_A_fkey";

-- DropForeignKey
ALTER TABLE "_BenefitToLoyaltyCardTier" DROP CONSTRAINT "_BenefitToLoyaltyCardTier_B_fkey";

-- DropForeignKey
ALTER TABLE "_LoyaltyProgramToUser" DROP CONSTRAINT "_LoyaltyProgramToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LoyaltyProgramToUser" DROP CONSTRAINT "_LoyaltyProgramToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_MobileUserToUserTag" DROP CONSTRAINT "_MobileUserToUserTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_MobileUserToUserTag" DROP CONSTRAINT "_MobileUserToUserTag_B_fkey";

-- DropIndex
DROP INDEX "PromocodeTransaction_mobileUserId_key";

-- AlterTable
ALTER TABLE "LTYBenefit" DROP COLUMN "benefitType",
ADD COLUMN     "benefitType" "LTYBenefitType" NOT NULL DEFAULT 'CASHBACK';

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "loyaltyProgramId";

-- AlterTable
ALTER TABLE "PromocodeTransaction" DROP COLUMN "mobileUserId";

-- DropTable
DROP TABLE "Benefit";

-- DropTable
DROP TABLE "BenefitActionType";

-- DropTable
DROP TABLE "CardBonusBank";

-- DropTable
DROP TABLE "CardBonusOper";

-- DropTable
DROP TABLE "CardBonusOperType";

-- DropTable
DROP TABLE "CardMobileUser";

-- DropTable
DROP TABLE "LTYdBonusOper";

-- DropTable
DROP TABLE "LoyaltyCardTier";

-- DropTable
DROP TABLE "LoyaltyProgram";

-- DropTable
DROP TABLE "MobileUser";

-- DropTable
DROP TABLE "OrderMobileUser";

-- DropTable
DROP TABLE "UserTag";

-- DropTable
DROP TABLE "_BenefitToLoyaltyCardTier";

-- DropTable
DROP TABLE "_LoyaltyProgramToUser";

-- DropTable
DROP TABLE "_MobileUserToUserTag";

-- DropEnum
DROP TYPE "BenefitType";

-- DropEnum
DROP TYPE "LoyaltyProgramStatus";

-- CreateTable
CREATE TABLE "LTYBonusOper" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER,
    "carWashDeviceId" INTEGER,
    "typeId" INTEGER,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "comment" TEXT,
    "creatorId" INTEGER,
    "orderId" INTEGER,

    CONSTRAINT "LTYBonusOper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYBonusOperType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "signOper" "SignOperType" NOT NULL,

    CONSTRAINT "LTYBonusOperType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LTYBonusOper" ADD CONSTRAINT "LTYBonusOper_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBonusOper" ADD CONSTRAINT "LTYBonusOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBonusOper" ADD CONSTRAINT "LTYBonusOper_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LTYBonusOperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBonusOper" ADD CONSTRAINT "LTYBonusOper_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBonusOper" ADD CONSTRAINT "LTYBonusOper_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LTYOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
