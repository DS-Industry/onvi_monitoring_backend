/*
  Warnings:

  - You are about to drop the column `typeMobileUser` on the `OrderMobileUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `CardMobileUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `PromocodeTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CardMobileUser" ADD COLUMN     "clientId" INTEGER;

-- AlterTable
ALTER TABLE "OrderMobileUser" DROP COLUMN "typeMobileUser",
ADD COLUMN     "contractType" "ContractType" NOT NULL DEFAULT 'INDIVIDUAL';

-- AlterTable
ALTER TABLE "PromocodeTransaction" ADD COLUMN     "clientId" INTEGER;

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "LTYUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "gender" TEXT,
    "status" "StatusUser" DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "contractType" "ContractType" NOT NULL DEFAULT 'INDIVIDUAL',
    "comment" TEXT,
    "inn" TEXT,
    "placementId" INTEGER,
    "refreshTokenId" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "mobileUserRoleId" INTEGER,

    CONSTRAINT "LTYUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LTYUserTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "LTYUserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LTYUserToLTYUserTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LTYUser_phone_key" ON "LTYUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "LTYUser_email_key" ON "LTYUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LTYUserToLTYUserTag_AB_unique" ON "_LTYUserToLTYUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LTYUserToLTYUserTag_B_index" ON "_LTYUserToLTYUserTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CardMobileUser_clientId_key" ON "CardMobileUser"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "PromocodeTransaction_clientId_key" ON "PromocodeTransaction"("clientId");

-- AddForeignKey
ALTER TABLE "PromocodeTransaction" ADD CONSTRAINT "PromocodeTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "LTYUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYUser" ADD CONSTRAINT "LTYUser_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYUser" ADD CONSTRAINT "LTYUser_mobileUserRoleId_fkey" FOREIGN KEY ("mobileUserRoleId") REFERENCES "MobileUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMobileUser" ADD CONSTRAINT "CardMobileUser_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "LTYUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYUserToLTYUserTag" ADD CONSTRAINT "_LTYUserToLTYUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYUserToLTYUserTag" ADD CONSTRAINT "_LTYUserToLTYUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "LTYUserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
