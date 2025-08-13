/*
  Warnings:

  - You are about to drop the column `clientId` on the `CardMobileUser` table. All the data in the column will be lost.
  - You are about to drop the column `cardMobileUserId` on the `LTYEquaring` table. All the data in the column will be lost.
  - You are about to drop the column `inn` on the `LTYUser` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LTYProgramStatus" AS ENUM ('ACTIVE', 'PAUSE');

-- CreateEnum
CREATE TYPE "LTYCardType" AS ENUM ('VIRTUAL', 'PHYSICAL');

-- DropForeignKey
ALTER TABLE "CardMobileUser" DROP CONSTRAINT "CardMobileUser_clientId_fkey";

-- DropForeignKey
ALTER TABLE "LTYEquaring" DROP CONSTRAINT "LTYEquaring_cardMobileUserId_fkey";

-- DropIndex
DROP INDEX "CardMobileUser_clientId_key";

-- AlterTable
ALTER TABLE "CardMobileUser" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "LTYEquaring" DROP COLUMN "cardMobileUserId",
ADD COLUMN     "cardId" INTEGER;

-- AlterTable
ALTER TABLE "LTYUser" DROP COLUMN "inn";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "ltyProgramId" INTEGER;

-- CreateTable
CREATE TABLE "LTYProgram" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "LTYProgramStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "lifetimeBonusDays" INTEGER,

    CONSTRAINT "LTYProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYBenefit" (
    "id" SERIAL NOT NULL,
    "benefitType" "BenefitType" NOT NULL,
    "name" TEXT NOT NULL,
    "bonus" INTEGER NOT NULL,
    "benefitActionTypeId" INTEGER,

    CONSTRAINT "LTYBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYBenefitActionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "LTYBenefitActionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYCardTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ltyProgramId" INTEGER NOT NULL,
    "limitBenefit" INTEGER NOT NULL,

    CONSTRAINT "LTYCardTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYCard" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "clientId" INTEGER,
    "unqNumber" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "LTYCardType" NOT NULL DEFAULT 'VIRTUAL',
    "monthlyLimit" INTEGER,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "cardTierId" INTEGER,

    CONSTRAINT "LTYCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYBonusBank" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER,
    "sum" INTEGER NOT NULL,
    "accrualAt" TIMESTAMP(3) NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LTYBonusBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYdBonusOper" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER,
    "carWashDeviceId" INTEGER,
    "typeOperId" INTEGER,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "comment" TEXT,
    "creatorId" INTEGER,
    "orderId" INTEGER,

    CONSTRAINT "LTYdBonusOper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYOrder" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sumFull" INTEGER NOT NULL,
    "sumReal" INTEGER NOT NULL,
    "sumBonus" INTEGER NOT NULL,
    "sumDiscount" INTEGER NOT NULL,
    "sumCashback" INTEGER NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "cardId" INTEGER,
    "contractType" "ContractType" NOT NULL DEFAULT 'INDIVIDUAL',
    "orderData" TIMESTAMP(3) NOT NULL,
    "createData" TIMESTAMP(3) NOT NULL,
    "orderHandlerStatus" "OrderHandlerStatus",
    "orderStatus" "OrderStatus" NOT NULL,
    "sendAnswerStatus" "SendAnswerStatus",
    "sendTime" TIMESTAMP(3),
    "debitingMoney" TIMESTAMP(3),
    "executionStatus" "ExecutionStatus",
    "reasonError" TEXT,
    "executionError" TEXT,
    "handlerError" TEXT,

    CONSTRAINT "LTYOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LTYProgramToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LTYBenefitToLTYCardTier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LTYCard_clientId_key" ON "LTYCard"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "_LTYProgramToUser_AB_unique" ON "_LTYProgramToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LTYProgramToUser_B_index" ON "_LTYProgramToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LTYBenefitToLTYCardTier_AB_unique" ON "_LTYBenefitToLTYCardTier"("A", "B");

-- CreateIndex
CREATE INDEX "_LTYBenefitToLTYCardTier_B_index" ON "_LTYBenefitToLTYCardTier"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBenefit" ADD CONSTRAINT "LTYBenefit_benefitActionTypeId_fkey" FOREIGN KEY ("benefitActionTypeId") REFERENCES "LTYBenefitActionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYCardTier" ADD CONSTRAINT "LTYCardTier_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYCard" ADD CONSTRAINT "LTYCard_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "LTYUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYCard" ADD CONSTRAINT "LTYCard_cardTierId_fkey" FOREIGN KEY ("cardTierId") REFERENCES "LTYCardTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYBonusBank" ADD CONSTRAINT "LTYBonusBank_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYdBonusOper" ADD CONSTRAINT "LTYdBonusOper_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYdBonusOper" ADD CONSTRAINT "LTYdBonusOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYdBonusOper" ADD CONSTRAINT "LTYdBonusOper_typeOperId_fkey" FOREIGN KEY ("typeOperId") REFERENCES "CardBonusOperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYdBonusOper" ADD CONSTRAINT "LTYdBonusOper_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYdBonusOper" ADD CONSTRAINT "LTYdBonusOper_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LTYOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYOrder" ADD CONSTRAINT "LTYOrder_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYOrder" ADD CONSTRAINT "LTYOrder_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYEquaring" ADD CONSTRAINT "LTYEquaring_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYProgramToUser" ADD CONSTRAINT "_LTYProgramToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYProgramToUser" ADD CONSTRAINT "_LTYProgramToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYBenefitToLTYCardTier" ADD CONSTRAINT "_LTYBenefitToLTYCardTier_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYBenefit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYBenefitToLTYCardTier" ADD CONSTRAINT "_LTYBenefitToLTYCardTier_B_fkey" FOREIGN KEY ("B") REFERENCES "LTYCardTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
