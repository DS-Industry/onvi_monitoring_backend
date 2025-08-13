/*
  Warnings:

  - Added the required column `countShifts` to the `HrPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrPayment" ADD COLUMN     "countShifts" INTEGER NOT NULL;
