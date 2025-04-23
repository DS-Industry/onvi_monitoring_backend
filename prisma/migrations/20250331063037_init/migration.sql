-- CreateEnum
CREATE TYPE "SignOperType" AS ENUM ('REPLENISHMENT', 'DEDUCTION');

-- CreateTable
CREATE TABLE "CardBonusOper" (
    "id" SERIAL NOT NULL,
    "cardMobileUserId" INTEGER,
    "carWashDeviceId" INTEGER,
    "typeOperId" INTEGER,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "comment" TEXT,
    "creatorId" INTEGER,

    CONSTRAINT "CardBonusOper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBonusOperType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "signOper" "SignOperType" NOT NULL,

    CONSTRAINT "CardBonusOperType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardBonusOper" ADD CONSTRAINT "CardBonusOper_cardMobileUserId_fkey" FOREIGN KEY ("cardMobileUserId") REFERENCES "CardMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBonusOper" ADD CONSTRAINT "CardBonusOper_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBonusOper" ADD CONSTRAINT "CardBonusOper_typeOperId_fkey" FOREIGN KEY ("typeOperId") REFERENCES "CardBonusOperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBonusOper" ADD CONSTRAINT "CardBonusOper_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
