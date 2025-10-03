/*
  Warnings:

  - You are about to drop the column `percentageSalary` on the `HrWorker` table. All the data in the column will be lost.
  - Added the required column `bonusPayout` to the `HrWorker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrWorker" DROP COLUMN "percentageSalary",
ADD COLUMN     "bonusPayout" INTEGER NOT NULL;
