/*
  Warnings:

  - Added the required column `name` to the `BenefitActionType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `LoyaltyProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `LoyaltyProgram` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoyaltyProgramStatus" AS ENUM ('ACTIVE', 'PAUSE');

-- AlterTable
ALTER TABLE "BenefitActionType" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LoyaltyCardTier" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "LoyaltyProgram" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "LoyaltyProgramStatus" NOT NULL;
