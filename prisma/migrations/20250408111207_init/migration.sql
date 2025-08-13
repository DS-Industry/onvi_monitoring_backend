/*
  Warnings:

  - You are about to drop the column `executeionError` on the `OrderMobileUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderMobileUser" DROP COLUMN "executeionError",
ADD COLUMN     "executionError" TEXT;
