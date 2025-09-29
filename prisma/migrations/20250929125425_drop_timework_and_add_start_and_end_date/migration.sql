/*
  Warnings:

  - You are about to drop the column `timeWork` on the `Pos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pos" DROP COLUMN "timeWork",
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT;
