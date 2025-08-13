/*
  Warnings:

  - You are about to drop the column `posId` on the `EquipmentKnot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EquipmentKnot" DROP CONSTRAINT "EquipmentKnot_posId_fkey";

-- AlterTable
ALTER TABLE "EquipmentKnot" DROP COLUMN "posId";

-- CreateTable
CREATE TABLE "_EquipmentKnotToPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentKnotToPos_AB_unique" ON "_EquipmentKnotToPos"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentKnotToPos_B_index" ON "_EquipmentKnotToPos"("B");

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToPos" ADD CONSTRAINT "_EquipmentKnotToPos_A_fkey" FOREIGN KEY ("A") REFERENCES "EquipmentKnot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToPos" ADD CONSTRAINT "_EquipmentKnotToPos_B_fkey" FOREIGN KEY ("B") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
