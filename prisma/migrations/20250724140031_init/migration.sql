-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('INDIVIDUAL', 'CORPORATE');

-- AlterTable
ALTER TABLE "MobileUser" ADD COLUMN     "contractType" "ContractType" NOT NULL DEFAULT 'INDIVIDUAL';
