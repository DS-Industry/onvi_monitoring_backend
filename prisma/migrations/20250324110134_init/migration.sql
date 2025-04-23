/*
  Warnings:

  - You are about to drop the column `code` on the `Benefit` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BenefitType" ADD VALUE 'GIFT_POINTS';

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "code";
