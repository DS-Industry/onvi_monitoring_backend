-- CreateTable
CREATE TABLE "LTYEquaring" (
    "id" SERIAL NOT NULL,
    "cardMobileUserId" INTEGER,
    "topUpSum" INTEGER NOT NULL,
    "totalBalance" INTEGER NOT NULL,
    "paymentGatewayId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LTYEquaring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LTYEquaring" ADD CONSTRAINT "LTYEquaring_cardMobileUserId_fkey" FOREIGN KEY ("cardMobileUserId") REFERENCES "CardMobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
