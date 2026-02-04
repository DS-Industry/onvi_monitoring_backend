-- CreateEnum
CREATE TYPE "StatusCard" AS ENUM ('INACTIVE');

-- AlterTable
ALTER TABLE "LTYCard" ADD COLUMN     "status" "StatusCard";
