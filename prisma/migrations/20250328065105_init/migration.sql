-- CreateEnum
CREATE TYPE "CardBonusOperType" AS ENUM ('ACCRUAL', 'DEDUCTION');

-- CreateTable
CREATE TABLE "CardBonusBank" (
    "id" SERIAL NOT NULL,
    "cardMobileUserId" INTEGER,
    "type" "CardBonusOperType" NOT NULL,
    "sum" INTEGER NOT NULL,
    "accrualAt" TIMESTAMP(3) NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardBonusOper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardBonusBank" ADD CONSTRAINT "CardBonusOper_cardMobileUserId_fkey" FOREIGN KEY ("cardMobileUserId") REFERENCES "CardMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
