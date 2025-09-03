-- CreateEnum
CREATE TYPE "MarketingCampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MarketingCampaignType" AS ENUM ('PROMOCODE', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "MarketingDiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "MarketingCampaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "MarketingCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "MarketingCampaignType" NOT NULL,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "ltyProgramId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingPromocode" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "promocode" TEXT NOT NULL,
    "discountType" "MarketingDiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "maxUsage" INTEGER,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingPromocode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingCampaignUsage" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "promocodeId" INTEGER,
    "ltyUserId" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "orderAmount" DOUBLE PRECISION NOT NULL,
    "posId" INTEGER,

    CONSTRAINT "MarketingCampaignUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MarketingCampaignToPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "MarketingCampaign_status_idx" ON "MarketingCampaign"("status");

-- CreateIndex
CREATE INDEX "MarketingCampaign_type_idx" ON "MarketingCampaign"("type");

-- CreateIndex
CREATE INDEX "MarketingCampaign_launchDate_idx" ON "MarketingCampaign"("launchDate");

-- CreateIndex
CREATE INDEX "MarketingCampaign_ltyProgramId_idx" ON "MarketingCampaign"("ltyProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingPromocode_promocode_key" ON "MarketingPromocode"("promocode");

-- CreateIndex
CREATE INDEX "MarketingPromocode_campaignId_idx" ON "MarketingPromocode"("campaignId");

-- CreateIndex
CREATE INDEX "MarketingPromocode_promocode_idx" ON "MarketingPromocode"("promocode");

-- CreateIndex
CREATE INDEX "MarketingPromocode_isActive_idx" ON "MarketingPromocode"("isActive");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_campaignId_idx" ON "MarketingCampaignUsage"("campaignId");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_ltyUserId_idx" ON "MarketingCampaignUsage"("ltyUserId");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_usedAt_idx" ON "MarketingCampaignUsage"("usedAt");

-- CreateIndex
CREATE INDEX "MarketingCampaignUsage_promocodeId_idx" ON "MarketingCampaignUsage"("promocodeId");

-- CreateIndex
CREATE UNIQUE INDEX "_MarketingCampaignToPos_AB_unique" ON "_MarketingCampaignToPos"("A", "B");

-- CreateIndex
CREATE INDEX "_MarketingCampaignToPos_B_index" ON "_MarketingCampaignToPos"("B");

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingPromocode" ADD CONSTRAINT "MarketingPromocode_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_promocodeId_fkey" FOREIGN KEY ("promocodeId") REFERENCES "MarketingPromocode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_ltyUserId_fkey" FOREIGN KEY ("ltyUserId") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingCampaignToPos" ADD CONSTRAINT "_MarketingCampaignToPos_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingCampaignToPos" ADD CONSTRAINT "_MarketingCampaignToPos_B_fkey" FOREIGN KEY ("B") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
