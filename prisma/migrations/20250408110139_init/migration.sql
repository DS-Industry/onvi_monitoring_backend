-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('ONVI', 'YANDEX', 'LUKOIL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('COMPLETED', 'ERROR');

-- CreateEnum
CREATE TYPE "SendAnswerStatus" AS ENUM ('SENT', 'NOT_SENT');

-- AlterTable
ALTER TABLE "CardBonusOper" ADD COLUMN     "orderMobileUserId" INTEGER;

-- CreateTable
CREATE TABLE "OrderMobileUser" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sumFull" INTEGER NOT NULL,
    "sumReal" INTEGER NOT NULL,
    "sumBonus" INTEGER NOT NULL,
    "sumDiscount" INTEGER NOT NULL,
    "sumCashback" INTEGER NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "cardMobileUserId" INTEGER,
    "typeMobileUser" "UserType" NOT NULL DEFAULT 'PHYSICAL',
    "orderData" TIMESTAMP(3) NOT NULL,
    "createData" TIMESTAMP(3) NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL,
    "sendAnswerStatus" "SendAnswerStatus",
    "sendTime" TIMESTAMP(3),
    "debitingMoney" TIMESTAMP(3),
    "executionStatus" "ExecutionStatus",
    "reasonError" TEXT,
    "executeionError" TEXT,

    CONSTRAINT "OrderMobileUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardBonusOper" ADD CONSTRAINT "CardBonusOper_orderMobileUserId_fkey" FOREIGN KEY ("orderMobileUserId") REFERENCES "OrderMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMobileUser" ADD CONSTRAINT "OrderMobileUser_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMobileUser" ADD CONSTRAINT "OrderMobileUser_cardMobileUserId_fkey" FOREIGN KEY ("cardMobileUserId") REFERENCES "CardMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
