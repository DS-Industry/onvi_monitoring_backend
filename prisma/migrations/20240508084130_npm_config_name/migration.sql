/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "refreshTokenId" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
