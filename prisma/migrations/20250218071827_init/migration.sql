-- CreateEnum
CREATE TYPE "StatusWorkDayShiftReport" AS ENUM ('CREATED', 'SAVED', 'SENT');

-- AlterTable
ALTER TABLE "WorkDayShiftReport" ADD COLUMN     "cashAtEnd" INTEGER,
ADD COLUMN     "cashAtStart" INTEGER,
ADD COLUMN     "status" "StatusWorkDayShiftReport";
