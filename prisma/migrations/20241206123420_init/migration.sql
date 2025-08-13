/*
  Warnings:

  - Added the required column `updateById` to the `Nomenclature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Nomenclature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nomenclature" ADD COLUMN     "updateById" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Nomenclature" ADD CONSTRAINT "Nomenclature_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
