/*
  Warnings:

  - You are about to drop the column `middlename` on the `MobileUser` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `MobileUser` table. All the data in the column will be lost.
  - Added the required column `color` to the `UserTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobileUser" DROP COLUMN "middlename",
DROP COLUMN "surname";

-- AlterTable
ALTER TABLE "UserTag" ADD COLUMN     "color" TEXT NOT NULL;
