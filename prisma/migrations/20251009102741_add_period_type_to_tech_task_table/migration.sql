/*
  Warnings:

  - You are about to drop the column `period` on the `TechTask` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- AlterTable
ALTER TABLE "TechTask" DROP COLUMN "period",
ADD COLUMN     "customPeriodDays" INTEGER,
ADD COLUMN     "periodType" "PeriodType";
