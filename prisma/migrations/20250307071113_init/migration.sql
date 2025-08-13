/*
  Warnings:

  - A unique constraint covering the columns `[confirmString]` on the table `OrganizationMailConfirm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthday` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `OrganizationMailConfirm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationMailConfirm" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "middlename" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "position" "PositionUser" NOT NULL,
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD COLUMN     "status" "StatusDeviceDataRaw" NOT NULL,
ADD COLUMN     "surname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMailConfirm_confirmString_key" ON "OrganizationMailConfirm"("confirmString");
