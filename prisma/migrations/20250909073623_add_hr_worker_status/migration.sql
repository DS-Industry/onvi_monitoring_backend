-- CreateEnum
CREATE TYPE "StatusHrWorker" AS ENUM ('WORKS', 'DISMISSED');

-- AlterTable
ALTER TABLE "HrWorker" ADD COLUMN     "status" "StatusHrWorker" NOT NULL DEFAULT 'WORKS';
