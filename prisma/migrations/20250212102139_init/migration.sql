-- CreateEnum
CREATE TYPE "TypeWorkDay" AS ENUM ('WORKING', 'WEEKEND', 'MEDICAL', 'VACATION', 'TIMEOFF', 'TRUANCY');

-- CreateEnum
CREATE TYPE "TypeEstimation" AS ENUM ('NO_VIOLATION', 'GROSS_VIOLATION', 'MINOR_VIOLATION', 'ONE_REMARK');

-- CreateTable
CREATE TABLE "ShiftReport" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "ShiftReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkDayShiftReport" (
    "id" SERIAL NOT NULL,
    "shiftReportId" INTEGER,
    "workDate" TIMESTAMP(3) NOT NULL,
    "typeWorkDay" "TypeWorkDay" NOT NULL,
    "startWorkingTime" TIMESTAMP(3),
    "endWorkingTime" TIMESTAMP(3),
    "estimation" "TypeEstimation",
    "prize" INTEGER,
    "fine" INTEGER,
    "comment" TEXT,
    "workerId" INTEGER,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "WorkDayShiftReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShiftReportToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ShiftReportToUser_AB_unique" ON "_ShiftReportToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShiftReportToUser_B_index" ON "_ShiftReportToUser"("B");

-- AddForeignKey
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDayShiftReport" ADD CONSTRAINT "WorkDayShiftReport_shiftReportId_fkey" FOREIGN KEY ("shiftReportId") REFERENCES "ShiftReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDayShiftReport" ADD CONSTRAINT "WorkDayShiftReport_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDayShiftReport" ADD CONSTRAINT "WorkDayShiftReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDayShiftReport" ADD CONSTRAINT "WorkDayShiftReport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftReportToUser" ADD CONSTRAINT "_ShiftReportToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftReportToUser" ADD CONSTRAINT "_ShiftReportToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
