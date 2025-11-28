/*
  Warnings:

  - You are about to drop the `HrPrepayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentType` to the `HrPayment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PAYMENT', 'PREPAYMENT');

-- DropForeignKey
ALTER TABLE "HrPrepayment" DROP CONSTRAINT "HrPrepayment_createdById_fkey";

-- DropForeignKey
ALTER TABLE "HrPrepayment" DROP CONSTRAINT "HrPrepayment_hrWorkerId_fkey";

-- AlterTable
ALTER TABLE "HrPayment" ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- DropTable
DROP TABLE "HrPrepayment";
