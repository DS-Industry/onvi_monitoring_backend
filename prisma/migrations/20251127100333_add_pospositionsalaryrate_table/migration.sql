-- CreateTable
CREATE TABLE "PosPositionSalaryRate" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,
    "hrPositionId" INTEGER NOT NULL,
    "baseRateDay" INTEGER,
    "bonusRateDay" INTEGER,
    "baseRateNight" INTEGER,
    "bonusRateNight" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PosPositionSalaryRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PosPositionSalaryRate_posId_hrPositionId_idx" ON "PosPositionSalaryRate"("posId", "hrPositionId");

-- CreateIndex
CREATE INDEX "PosPositionSalaryRate_hrPositionId_idx" ON "PosPositionSalaryRate"("hrPositionId");

-- CreateIndex
CREATE UNIQUE INDEX "PosPositionSalaryRate_posId_hrPositionId_key" ON "PosPositionSalaryRate"("posId", "hrPositionId");

-- AddForeignKey
ALTER TABLE "PosPositionSalaryRate" ADD CONSTRAINT "PosPositionSalaryRate_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosPositionSalaryRate" ADD CONSTRAINT "PosPositionSalaryRate_hrPositionId_fkey" FOREIGN KEY ("hrPositionId") REFERENCES "HrPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
