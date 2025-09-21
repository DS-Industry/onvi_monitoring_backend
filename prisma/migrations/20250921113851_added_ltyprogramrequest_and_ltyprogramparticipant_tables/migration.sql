/*
  Warnings:

  - You are about to drop the `MarketingPromocode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LTYProgramToOrganization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LTYProgramToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LTYProgramRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LTYProgramParticipantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "PromocodeType" AS ENUM ('CAMPAIGN', 'PERSONAL', 'STANDALONE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SERVICE');

-- DropForeignKey
ALTER TABLE "MarketingCampaignUsage" DROP CONSTRAINT "MarketingCampaignUsage_promocodeId_fkey";

-- DropForeignKey
ALTER TABLE "MarketingPromocode" DROP CONSTRAINT "MarketingPromocode_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "MarketingPromocode" DROP CONSTRAINT "MarketingPromocode_placementId_fkey";

-- DropForeignKey
ALTER TABLE "_LTYProgramToOrganization" DROP CONSTRAINT "_LTYProgramToOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_LTYProgramToOrganization" DROP CONSTRAINT "_LTYProgramToOrganization_B_fkey";

-- DropForeignKey
ALTER TABLE "_LTYProgramToUser" DROP CONSTRAINT "_LTYProgramToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LTYProgramToUser" DROP CONSTRAINT "_LTYProgramToUser_B_fkey";

-- AlterTable
ALTER TABLE "LTYProgram" ADD COLUMN     "isHub" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "participantLimit" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "MarketingPromocode";

-- DropTable
DROP TABLE "_LTYProgramToOrganization";

-- DropTable
DROP TABLE "_LTYProgramToUser";

-- CreateTable
CREATE TABLE "LTYProgramParticipant" (
    "id" SERIAL NOT NULL,
    "ltyProgramId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "status" "LTYProgramParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivatedAt" TIMESTAMP(3),
    "requestId" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commissionRate" DECIMAL(65,30),

    CONSTRAINT "LTYProgramParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYProgramParticipantRequest" (
    "id" SERIAL NOT NULL,
    "ltyProgramId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "status" "LTYProgramRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,
    "requestComment" TEXT,
    "responseComment" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LTYProgramParticipantRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYPromocode" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER,
    "code" TEXT NOT NULL,
    "promocodeType" "PromocodeType" NOT NULL,
    "personalUserId" INTEGER,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minOrderAmount" DECIMAL(10,2),
    "maxDiscountAmount" DECIMAL(10,2),
    "maxUsage" INTEGER,
    "maxUsagePerUser" INTEGER NOT NULL DEFAULT 1,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByManagerId" INTEGER,
    "createdReason" TEXT,
    "usageRestrictions" JSONB,
    "organizationId" INTEGER,
    "posId" INTEGER,
    "placementId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LTYPromocode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LTYProgramParticipant_status_idx" ON "LTYProgramParticipant"("status");

-- CreateIndex
CREATE INDEX "LTYProgramParticipant_ltyProgramId_idx" ON "LTYProgramParticipant"("ltyProgramId");

-- CreateIndex
CREATE INDEX "LTYProgramParticipant_organizationId_idx" ON "LTYProgramParticipant"("organizationId");

-- CreateIndex
CREATE INDEX "LTYProgramParticipant_requestId_idx" ON "LTYProgramParticipant"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "LTYProgramParticipant_ltyProgramId_organizationId_key" ON "LTYProgramParticipant"("ltyProgramId", "organizationId");

-- CreateIndex
CREATE INDEX "LTYProgramParticipantRequest_status_idx" ON "LTYProgramParticipantRequest"("status");

-- CreateIndex
CREATE INDEX "LTYProgramParticipantRequest_ltyProgramId_idx" ON "LTYProgramParticipantRequest"("ltyProgramId");

-- CreateIndex
CREATE INDEX "LTYProgramParticipantRequest_organizationId_idx" ON "LTYProgramParticipantRequest"("organizationId");

-- CreateIndex
CREATE INDEX "LTYProgramParticipantRequest_requestedAt_idx" ON "LTYProgramParticipantRequest"("requestedAt");

-- CreateIndex
CREATE INDEX "LTYProgramParticipantRequest_approvedAt_idx" ON "LTYProgramParticipantRequest"("approvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LTYProgramParticipantRequest_ltyProgramId_organizationId_key" ON "LTYProgramParticipantRequest"("ltyProgramId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "LTYPromocode_code_key" ON "LTYPromocode"("code");

-- CreateIndex
CREATE INDEX "LTYPromocode_code_isActive_idx" ON "LTYPromocode"("code", "isActive");

-- CreateIndex
CREATE INDEX "LTYPromocode_campaignId_promocodeType_idx" ON "LTYPromocode"("campaignId", "promocodeType");

-- CreateIndex
CREATE INDEX "LTYPromocode_personalUserId_isActive_idx" ON "LTYPromocode"("personalUserId", "isActive");

-- CreateIndex
CREATE INDEX "LTYPromocode_createdByManagerId_promocodeType_idx" ON "LTYPromocode"("createdByManagerId", "promocodeType");

-- CreateIndex
CREATE INDEX "LTYPromocode_organizationId_isActive_idx" ON "LTYPromocode"("organizationId", "isActive");

-- CreateIndex
CREATE INDEX "LTYPromocode_posId_isActive_idx" ON "LTYPromocode"("posId", "isActive");

-- CreateIndex
CREATE INDEX "LTYPromocode_validFrom_validUntil_idx" ON "LTYPromocode"("validFrom", "validUntil");

-- AddForeignKey
ALTER TABLE "LTYProgramParticipant" ADD CONSTRAINT "LTYProgramParticipant_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramParticipant" ADD CONSTRAINT "LTYProgramParticipant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramParticipant" ADD CONSTRAINT "LTYProgramParticipant_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "LTYProgramParticipantRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramParticipantRequest" ADD CONSTRAINT "LTYProgramParticipantRequest_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramParticipantRequest" ADD CONSTRAINT "LTYProgramParticipantRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramParticipantRequest" ADD CONSTRAINT "LTYProgramParticipantRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_personalUserId_fkey" FOREIGN KEY ("personalUserId") REFERENCES "LTYUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYPromocode" ADD CONSTRAINT "LTYPromocode_createdByManagerId_fkey" FOREIGN KEY ("createdByManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignUsage" ADD CONSTRAINT "MarketingCampaignUsage_promocodeId_fkey" FOREIGN KEY ("promocodeId") REFERENCES "LTYPromocode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
