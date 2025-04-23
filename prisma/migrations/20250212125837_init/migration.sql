/*
  Warnings:

  - Added the required column `createdAt` to the `ShiftReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ShiftReport` table without a default value. This is not possible if the table is not empty.
  - Made the column `startDate` on table `ShiftReport` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdAt` to the `WorkDayShiftReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkDayShiftReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftReport" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkDayShiftReport" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
