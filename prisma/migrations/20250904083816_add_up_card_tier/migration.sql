/*
  Warnings:

  - A unique constraint covering the columns `[upCardTierId]` on the table `LTYCardTier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LTYCardTier" ADD COLUMN     "upCardTierId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "LTYCardTier_upCardTierId_key" ON "LTYCardTier"("upCardTierId");

-- AddForeignKey
ALTER TABLE "LTYCardTier" ADD CONSTRAINT "LTYCardTier_upCardTierId_fkey" FOREIGN KEY ("upCardTierId") REFERENCES "LTYCardTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
