/*
  Warnings:

  - You are about to drop the column `type` on the `CardBonusBank` table. All the data in the column will be lost.
  - Made the column `expiryAt` on table `CardBonusBank` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardBonusBank" DROP COLUMN "type",
ALTER COLUMN "expiryAt" SET NOT NULL;

-- DropEnum
DROP TYPE "CardBonusOperType";
