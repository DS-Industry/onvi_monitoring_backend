-- CreateTable
CREATE TABLE "LTYCardTierHist" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "transitionDate" TIMESTAMP(3) NOT NULL,
    "oldCardTierId" INTEGER NOT NULL,
    "newCardTierId" INTEGER NOT NULL,

    CONSTRAINT "LTYCardTierHist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LTYCardTierHist" ADD CONSTRAINT "LTYCardTierHist_oldCardTierId_fkey" FOREIGN KEY ("oldCardTierId") REFERENCES "LTYCardTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYCardTierHist" ADD CONSTRAINT "LTYCardTierHist_newCardTierId_fkey" FOREIGN KEY ("newCardTierId") REFERENCES "LTYCardTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYCardTierHist" ADD CONSTRAINT "LTYCardTierHist_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "LTYCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
