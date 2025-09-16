-- AlterTable
ALTER TABLE "MarketingPromocode" ADD COLUMN     "placementId" INTEGER;

-- AlterTable
ALTER TABLE "Placement" ADD COLUMN     "regionCode" TEXT;

-- CreateTable
CREATE TABLE "_MarketingCampaignToLTYUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MarketingCampaignToLTYUser_AB_unique" ON "_MarketingCampaignToLTYUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MarketingCampaignToLTYUser_B_index" ON "_MarketingCampaignToLTYUser"("B");

-- AddForeignKey
ALTER TABLE "MarketingPromocode" ADD CONSTRAINT "MarketingPromocode_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingCampaignToLTYUser" ADD CONSTRAINT "_MarketingCampaignToLTYUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingCampaignToLTYUser" ADD CONSTRAINT "_MarketingCampaignToLTYUser_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
