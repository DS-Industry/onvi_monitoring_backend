/*
  Warnings:

  - You are about to drop the column `apperanceDate` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `deviceIncident` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `updateById` on the `Incident` table. All the data in the column will be lost.
  - Added the required column `appearanceDate` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectName` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_updateById_fkey";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "apperanceDate",
DROP COLUMN "deviceIncident",
DROP COLUMN "updateById",
ADD COLUMN     "appearanceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "objectName" TEXT NOT NULL,
ADD COLUMN     "updatedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
