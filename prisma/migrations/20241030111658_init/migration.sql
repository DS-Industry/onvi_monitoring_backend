/*
  Warnings:

  - You are about to drop the column `incidentReasonId` on the `IncidentSolution` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncidentSolution" DROP CONSTRAINT "IncidentSolution_incidentReasonId_fkey";

-- AlterTable
ALTER TABLE "IncidentSolution" DROP COLUMN "incidentReasonId";

-- CreateTable
CREATE TABLE "_IncidentNameToIncidentSolution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IncidentNameToIncidentSolution_AB_unique" ON "_IncidentNameToIncidentSolution"("A", "B");

-- CreateIndex
CREATE INDEX "_IncidentNameToIncidentSolution_B_index" ON "_IncidentNameToIncidentSolution"("B");

-- AddForeignKey
ALTER TABLE "_IncidentNameToIncidentSolution" ADD CONSTRAINT "_IncidentNameToIncidentSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "IncidentName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentNameToIncidentSolution" ADD CONSTRAINT "_IncidentNameToIncidentSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "IncidentSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
