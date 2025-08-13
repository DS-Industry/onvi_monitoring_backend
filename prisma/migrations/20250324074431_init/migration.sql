/*
  Warnings:

  - You are about to drop the column `loyaltyProgramId` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `LoyaltyProgram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `LoyaltyProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_loyaltyProgramId_fkey";

-- AlterTable
ALTER TABLE "LoyaltyProgram" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "loyaltyProgramId";

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyProgram_organizationId_key" ON "LoyaltyProgram"("organizationId");

-- AddForeignKey
ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
