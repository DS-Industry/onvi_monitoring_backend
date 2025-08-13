/*
  Warnings:

  - You are about to drop the `_EquipmentKnotToPos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `posId` to the `EquipmentKnot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EquipmentKnotToPos" DROP CONSTRAINT "_EquipmentKnotToPos_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentKnotToPos" DROP CONSTRAINT "_EquipmentKnotToPos_B_fkey";

-- AlterTable
ALTER TABLE "EquipmentKnot" ADD COLUMN     "posId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_EquipmentKnotToPos";

-- AddForeignKey
ALTER TABLE "EquipmentKnot" ADD CONSTRAINT "EquipmentKnot_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
