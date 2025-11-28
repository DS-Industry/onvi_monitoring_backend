/*
  Warnings:

  - You are about to drop the column `discountType` on the `MarketingCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `MarketingCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `MarketingCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `benefitId` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `minAmount` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `promocodeId` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `visitCount` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `weekdays` on the `MarketingCampaignCondition` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `MarketingCampaignUsage` table. All the data in the column will be lost.
  - You are about to drop the column `orderAmount` on the `MarketingCampaignUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[actionId]` on the table `LTYPromocode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CampaignExecutionType" AS ENUM ('TRANSACTIONAL', 'BEHAVIORAL');

-- CreateEnum
CREATE TYPE "MarketingCampaignActionType" AS ENUM ('DISCOUNT', 'CASHBACK_BOOST', 'GIFT_POINTS', 'PROMOCODE_ISSUE', 'TIER_UPGRADE');

-- CreateEnum
CREATE TYPE "CampaignRedemptionType" AS ENUM ('DISCOUNT', 'CASHBACK', 'PROMOCODE', 'GIFT_POINTS', 'TRIGGER');

-- CreateEnum
CREATE TYPE "ActivationWindowStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "MarketingCampaignCondition" DROP CONSTRAINT "MarketingCampaignCondition_benefitId_fkey";

-- DropForeignKey
ALTER TABLE "MarketingCampaignCondition" DROP CONSTRAINT "MarketingCampaignCondition_promocodeId_fkey";

-- DropIndex
DROP INDEX "MarketingCampaign_type_idx";

-- DropIndex
DROP INDEX "MarketingCampaignCondition_campaignId_order_idx";

-- DropIndex
DROP INDEX "MarketingCampaignCondition_type_idx";

-- AlterTable
ALTER TABLE "LTYPromocode" ADD COLUMN     "actionId" INTEGER,
ALTER COLUMN "discountType" DROP NOT NULL,
ALTER COLUMN "discountValue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MarketingCampaign" DROP COLUMN "discountType",
DROP COLUMN "discountValue",
DROP COLUMN "type",
ADD COLUMN     "executionType" "CampaignExecutionType";

-- AlterTable
ALTER TABLE "MarketingCampaignCondition" DROP COLUMN "benefitId",
DROP COLUMN "endTime",
DROP COLUMN "minAmount",
DROP COLUMN "order",
DROP COLUMN "promocodeId",
DROP COLUMN "startTime",
DROP COLUMN "type",
DROP COLUMN "visitCount",
DROP COLUMN "weekdays",
ADD COLUMN     "tree" JSONB;

-- AlterTable
ALTER TABLE "MarketingCampaignUsage" DROP COLUMN "discountAmount",
DROP COLUMN "orderAmount",
ADD COLUMN     "actionId" INTEGER,
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "type" "CampaignRedemptionType";

-- CreateTable
CREATE TABLE "MarketingCampaignAction" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "actionType" "MarketingCampaignActionType" NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "MarketingCampaignAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCampaignProgress" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "ltyUserId" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "cycleStartedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCampaignProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationWindow" (
    "id" SERIAL NOT NULL,
    "ltyUserId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ActivationWindowStatus" NOT NULL,

    CONSTRAINT "ActivationWindow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingCampaignAction_campaignId_key" ON "MarketingCampaignAction"("campaignId");

-- CreateIndex
CREATE INDEX "MarketingCampaignAction_campaignId_idx" ON "MarketingCampaignAction"("campaignId");

-- CreateIndex
CREATE INDEX "UserCampaignProgress_campaignId_ltyUserId_updatedAt_idx" ON "UserCampaignProgress"("campaignId", "ltyUserId", "updatedAt");

-- CreateIndex
CREATE INDEX "UserCampaignProgress_ltyUserId_completedAt_idx" ON "UserCampaignProgress"("ltyUserId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserCampaignProgress_campaignId_ltyUserId_key" ON "UserCampaignProgress"("campaignId", "ltyUserId");

-- CreateIndex
CREATE INDEX "ActivationWindow_ltyUserId_endAt_status_idx" ON "ActivationWindow"("ltyUserId", "endAt", "status");

-- CreateIndex
CREATE INDEX "ActivationWindow_campaignId_startAt_endAt_idx" ON "ActivationWindow"("campaignId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "ActivationWindow_status_endAt_idx" ON "ActivationWindow"("status", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "LTYPromocode_actionId_key" ON "LTYPromocode"("actionId");

-- CreateIndex
CREATE INDEX "LTYPromocode_actionId_idx" ON "LTYPromocode"("actionId");

-- CreateIndex
CREATE INDEX "MarketingCampaign_executionType_idx" ON "MarketingCampaign"("executionType");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_type_idx" ON "MarketingCampaignUsage"("type");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_orderId_idx" ON "MarketingCampaignUsage"("orderId");

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "MarketingCampaignAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "MarketingCampaignAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LTYOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignAction" ADD CONSTRAINT "MarketingCampaignAction_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCampaignProgress" ADD CONSTRAINT "UserCampaignProgress_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCampaignProgress" ADD CONSTRAINT "UserCampaignProgress_ltyUserId_fkey" FOREIGN KEY ("ltyUserId") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationWindow" ADD CONSTRAINT "ActivationWindow_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationWindow" ADD CONSTRAINT "ActivationWindow_ltyUserId_fkey" FOREIGN KEY ("ltyUserId") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationWindow" ADD CONSTRAINT "ActivationWindow_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "MarketingCampaignAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
