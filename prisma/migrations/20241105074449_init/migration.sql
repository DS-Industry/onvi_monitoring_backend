/*
  Warnings:

  - Added the required column `nextCreateDate` to the `TechTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "StatusTechTask" ADD VALUE 'OVERDUE';

-- AlterTable
ALTER TABLE "TechTask" ADD COLUMN     "nextCreateDate" TIMESTAMP(3) NOT NULL;
