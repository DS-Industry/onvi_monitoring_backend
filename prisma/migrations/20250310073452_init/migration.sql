/*
  Warnings:

  - You are about to drop the column `monthlyPlan` on the `Pos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pos" DROP COLUMN "monthlyPlan";

-- CreateTable
CREATE TABLE "MonthlyPlanPos" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,
    "monthDate" TIMESTAMP(3) NOT NULL,
    "monthlyPlan" INTEGER NOT NULL,

    CONSTRAINT "MonthlyPlanPos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonthlyPlanPos" ADD CONSTRAINT "MonthlyPlanPos_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
