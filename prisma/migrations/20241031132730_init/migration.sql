/*
  Warnings:

  - You are about to drop the column `carWashDeviceId` on the `Incident` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_carWashDeviceId_fkey";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "carWashDeviceId";
