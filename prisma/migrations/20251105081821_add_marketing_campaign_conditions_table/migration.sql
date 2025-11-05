-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "MarketingCampaignConditionType" AS ENUM ('TIME_RANGE', 'WEEKDAY', 'EVENT', 'VISIT_COUNT', 'PURCHASE_AMOUNT', 'PROMOCODE_ENTRY');

-- CreateTable
CREATE TABLE "MarketingCampaignCondition" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "type" "MarketingCampaignConditionType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "weekdays" "Weekday"[],
    "visitCount" INTEGER,
    "minAmount" DECIMAL(10,2),
    "promocodeId" INTEGER,
    "benefitId" INTEGER,

    CONSTRAINT "MarketingCampaignCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketingCampaignCondition_campaignId_idx" ON "MarketingCampaignCondition"("campaignId");

-- CreateIndex
CREATE INDEX "MarketingCampaignCondition_type_idx" ON "MarketingCampaignCondition"("type");

-- CreateIndex
CREATE INDEX "MarketingCampaignCondition_campaignId_order_idx" ON "MarketingCampaignCondition"("campaignId", "order");

-- AddForeignKey
ALTER TABLE "MarketingCampaignCondition" ADD CONSTRAINT "MarketingCampaignCondition_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "LTYBenefit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignCondition" ADD CONSTRAINT "MarketingCampaignCondition_promocodeId_fkey" FOREIGN KEY ("promocodeId") REFERENCES "LTYPromocode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignCondition" ADD CONSTRAINT "MarketingCampaignCondition_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
