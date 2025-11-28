-- AlterTable
ALTER TABLE "ActivationWindow" ALTER COLUMN "endAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MarketingCampaign" ADD COLUMN     "activeDays" INTEGER;
