/*
  Warnings:

  - You are about to drop the column `ownerOrganizationId` on the `MarketingCampaign` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MarketingCampaign" DROP CONSTRAINT "MarketingCampaign_ownerOrganizationId_fkey";

-- DropIndex
DROP INDEX "MarketingCampaign_ownerOrganizationId_idx";

-- AlterTable
ALTER TABLE "MarketingCampaign" DROP COLUMN "ownerOrganizationId",
ADD COLUMN     "ltyProgramParticipantId" INTEGER;

-- CreateIndex
CREATE INDEX "MarketingCampaign_ltyProgramParticipantId_idx" ON "MarketingCampaign"("ltyProgramParticipantId");

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_ltyProgramParticipantId_fkey" FOREIGN KEY ("ltyProgramParticipantId") REFERENCES "LTYProgramParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
