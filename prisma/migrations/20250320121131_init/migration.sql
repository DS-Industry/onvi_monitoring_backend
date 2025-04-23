/*
  Warnings:

  - Added the required column `benefitType` to the `Benefit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('CASHBACK');

-- AlterTable
ALTER TABLE "Benefit" ADD COLUMN     "benefitType" "BenefitType" NOT NULL;
