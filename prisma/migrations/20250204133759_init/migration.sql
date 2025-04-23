-- CreateEnum
CREATE TYPE "StatusCashCollection" AS ENUM ('CREATED', 'SAVED', 'SENT');

-- CreateTable
CREATE TABLE "CashCollection" (
    "id" SERIAL NOT NULL,
    "cashCallectionDate" TIMESTAMP(3) NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "status" "StatusCashCollection" NOT NULL,
    "sumFact" INTEGER NOT NULL,
    "posId" INTEGER,
    "shortage" INTEGER NOT NULL,
    "sumCard" INTEGER NOT NULL,
    "countCar" INTEGER NOT NULL,
    "countCarCard" INTEGER NOT NULL,
    "averageCheck" INTEGER NOT NULL,
    "virtualSum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "CashCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashCollectionDeviceType" (
    "id" SERIAL NOT NULL,
    "cashCollectionId" INTEGER,
    "carWashDeviceTypeId" INTEGER,
    "sumFact" INTEGER NOT NULL,
    "sumCoin" INTEGER NOT NULL,
    "sumPaper" INTEGER NOT NULL,
    "shortage" INTEGER NOT NULL,
    "virtualSum" INTEGER NOT NULL,

    CONSTRAINT "CashCollectionDeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashCollectionDevice" (
    "id" SERIAL NOT NULL,
    "cashCollectionId" INTEGER,
    "carWashDeviceId" INTEGER,
    "tookMoneyTime" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "sumCoin" INTEGER NOT NULL,
    "sumPaper" INTEGER NOT NULL,
    "virtualSum" INTEGER NOT NULL,

    CONSTRAINT "CashCollectionDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashCollection" ADD CONSTRAINT "CashCollection_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollection" ADD CONSTRAINT "CashCollection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollection" ADD CONSTRAINT "CashCollection_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollectionDeviceType" ADD CONSTRAINT "CashCollectionDeviceType_cashCollectionId_fkey" FOREIGN KEY ("cashCollectionId") REFERENCES "CashCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollectionDeviceType" ADD CONSTRAINT "CashCollectionDeviceType_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollectionDevice" ADD CONSTRAINT "CashCollectionDevice_cashCollectionId_fkey" FOREIGN KEY ("cashCollectionId") REFERENCES "CashCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashCollectionDevice" ADD CONSTRAINT "CashCollectionDevice_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
