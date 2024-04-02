/*
  Warnings:

  - Added the required column `password` to the `PlatformUser` table without a default value. This is not possible if the table is not empty.
  - Made the column `surname` on table `PlatformUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `PlatformUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `PlatformUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PlatformUser" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "surname" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
