/*
  Warnings:

  - Made the column `birthday` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "birthday" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "countryCode" DROP NOT NULL,
ALTER COLUMN "timezone" DROP NOT NULL;
