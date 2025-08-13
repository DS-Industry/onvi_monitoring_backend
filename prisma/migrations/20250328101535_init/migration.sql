/*
  Warnings:

  - You are about to drop the `CardBonusBank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardBonusBank" DROP CONSTRAINT "CardBonusOper_cardMobileUserId_fkey";

-- DropTable
DROP TABLE "CardBonusBank";

-- CreateTable
CREATE TABLE "CardBonusBank" (
    "id" SERIAL NOT NULL,
    "cardMobileUserId" INTEGER,
    "sum" INTEGER NOT NULL,
    "accrualAt" TIMESTAMP(3) NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardBonusBank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardBonusBank" ADD CONSTRAINT "CardBonusBank_cardMobileUserId_fkey" FOREIGN KEY ("cardMobileUserId") REFERENCES "CardMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
