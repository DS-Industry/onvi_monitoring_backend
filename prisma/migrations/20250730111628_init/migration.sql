/*
  Warnings:

  - You are about to drop the column `fine` on the `MNGShiftReport` table. All the data in the column will be lost.
  - You are about to drop the column `prize` on the `MNGShiftReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MNGShiftReport" DROP COLUMN "fine",
DROP COLUMN "prize";

-- CreateTable
CREATE TABLE "MNGGradingParameter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weightPercent" INTEGER NOT NULL,

    CONSTRAINT "MNGGradingParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNGShiftGrading" (
    "id" SERIAL NOT NULL,
    "shiftReportId" INTEGER,
    "gradingParameterId" INTEGER,
    "gradingEstimationId" INTEGER,

    CONSTRAINT "MNGShiftGrading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNGGradingEstimation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weightPercent" INTEGER NOT NULL,

    CONSTRAINT "MNGGradingEstimation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MNGShiftGrading" ADD CONSTRAINT "MNGShiftGrading_shiftReportId_fkey" FOREIGN KEY ("shiftReportId") REFERENCES "MNGShiftReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftGrading" ADD CONSTRAINT "MNGShiftGrading_gradingParameterId_fkey" FOREIGN KEY ("gradingParameterId") REFERENCES "MNGGradingParameter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNGShiftGrading" ADD CONSTRAINT "MNGShiftGrading_gradingEstimationId_fkey" FOREIGN KEY ("gradingEstimationId") REFERENCES "MNGGradingEstimation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
