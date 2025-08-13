/*
  Warnings:

  - You are about to drop the column `equipmentId` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the `IncidentName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EquipmentToEquipmentKnot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `incidentReasonId` to the `IncidentSolution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToEquipmentKnot" DROP CONSTRAINT "_EquipmentToEquipmentKnot_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToEquipmentKnot" DROP CONSTRAINT "_EquipmentToEquipmentKnot_B_fkey";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "equipmentId",
ADD COLUMN     "incidentNameId" INTEGER;

-- AlterTable
ALTER TABLE "IncidentSolution" ADD COLUMN     "incidentReasonId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "IncidentName";

-- DropTable
DROP TABLE "_EquipmentToEquipmentKnot";

-- CreateTable
CREATE TABLE "IncidentName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentKnotToIncidentName" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_IncidentNameToIncidentReason" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentKnotToIncidentName_AB_unique" ON "_EquipmentKnotToIncidentName"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentKnotToIncidentName_B_index" ON "_EquipmentKnotToIncidentName"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IncidentNameToIncidentReason_AB_unique" ON "_IncidentNameToIncidentReason"("A", "B");

-- CreateIndex
CREATE INDEX "_IncidentNameToIncidentReason_B_index" ON "_IncidentNameToIncidentReason"("B");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentNameId_fkey" FOREIGN KEY ("incidentNameId") REFERENCES "IncidentName"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentSolution" ADD CONSTRAINT "IncidentSolution_incidentReasonId_fkey" FOREIGN KEY ("incidentReasonId") REFERENCES "IncidentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToIncidentName" ADD CONSTRAINT "_EquipmentKnotToIncidentName_A_fkey" FOREIGN KEY ("A") REFERENCES "EquipmentKnot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToIncidentName" ADD CONSTRAINT "_EquipmentKnotToIncidentName_B_fkey" FOREIGN KEY ("B") REFERENCES "IncidentName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentNameToIncidentReason" ADD CONSTRAINT "_IncidentNameToIncidentReason_A_fkey" FOREIGN KEY ("A") REFERENCES "IncidentName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentNameToIncidentReason" ADD CONSTRAINT "_IncidentNameToIncidentReason_B_fkey" FOREIGN KEY ("B") REFERENCES "IncidentInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
