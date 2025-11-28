/*
  Warnings:

  - You are about to drop the column `percentageSalary` on the `HrWorker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HrWorker" DROP COLUMN "percentageSalary",
ADD COLUMN     "bonusPayout" INTEGER;
