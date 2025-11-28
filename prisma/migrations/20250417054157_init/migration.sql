/*
  Warnings:

  - Added the required column `updatedAt` to the `HrPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `HrPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrPayment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HrPayment" ADD CONSTRAINT "HrPayment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
