-- AlterTable
ALTER TABLE "LTYProgram" ADD COLUMN     "burnoutType" TEXT,
ADD COLUMN     "hasBonusWithSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxRedeemPercentage" INTEGER;
