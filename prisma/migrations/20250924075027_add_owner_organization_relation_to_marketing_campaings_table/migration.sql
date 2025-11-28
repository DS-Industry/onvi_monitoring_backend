-- AlterTable
ALTER TABLE "MarketingCampaign" ADD COLUMN     "ownerOrganizationId" INTEGER;

-- CreateIndex
CREATE INDEX "MarketingCampaign_ownerOrganizationId_idx" ON "MarketingCampaign"("ownerOrganizationId");

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_ownerOrganizationId_fkey" FOREIGN KEY ("ownerOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
