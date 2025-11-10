-- CreateEnum
CREATE TYPE "MarketingCampaignMobileDisplayType" AS ENUM ('PersonalPromocode', 'Promo');

-- CreateTable
CREATE TABLE "MarketingCampaignMobileDisplay" (
    "id" SERIAL NOT NULL,
    "marketingCampaignId" INTEGER NOT NULL,
    "imageLink" TEXT NOT NULL,
    "description" TEXT,
    "type" "MarketingCampaignMobileDisplayType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingCampaignMobileDisplay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingCampaignMobileDisplay_marketingCampaignId_key" ON "MarketingCampaignMobileDisplay"("marketingCampaignId");

-- CreateIndex
CREATE INDEX "MarketingCampaignMobileDisplay_marketingCampaignId_idx" ON "MarketingCampaignMobileDisplay"("marketingCampaignId");

-- AddForeignKey
ALTER TABLE "MarketingCampaignMobileDisplay" ADD CONSTRAINT "MarketingCampaignMobileDisplay_marketingCampaignId_fkey" FOREIGN KEY ("marketingCampaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
