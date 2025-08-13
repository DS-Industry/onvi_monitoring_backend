/*
  Warnings:

  - You are about to drop the column `country` on the `MobileUser` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `MobileUser` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `MobileUser` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PHYSICAL', 'LEGAL');

-- AlterEnum
ALTER TYPE "StatusUser" ADD VALUE 'VERIFICATE';

-- AlterTable
ALTER TABLE "MobileUser" DROP COLUMN "country",
DROP COLUMN "countryCode",
DROP COLUMN "timezone",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "inn" TEXT,
ADD COLUMN     "placementId" INTEGER,
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'PHYSICAL';

-- CreateTable
CREATE TABLE "UserTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardMobileUser" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "mobileUserId" INTEGER,
    "devNumber" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "monthlyLimit" INTEGER,

    CONSTRAINT "CardMobileUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MobileUserToUserTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CardMobileUser_mobileUserId_key" ON "CardMobileUser"("mobileUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_MobileUserToUserTag_AB_unique" ON "_MobileUserToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MobileUserToUserTag_B_index" ON "_MobileUserToUserTag"("B");

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMobileUser" ADD CONSTRAINT "CardMobileUser_mobileUserId_fkey" FOREIGN KEY ("mobileUserId") REFERENCES "MobileUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MobileUserToUserTag" ADD CONSTRAINT "_MobileUserToUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "MobileUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MobileUserToUserTag" ADD CONSTRAINT "_MobileUserToUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
