/*
  Warnings:

  - You are about to drop the `IncidentInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentSolution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IncidentNameToIncidentReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IncidentNameToIncidentSolution` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "IncidentInfoType" AS ENUM ('Reason', 'Solution');

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_incidentReasonId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_incidentSolutionId_fkey";

-- DropForeignKey
ALTER TABLE "_IncidentNameToIncidentReason" DROP CONSTRAINT "_IncidentNameToIncidentReason_A_fkey";

-- DropForeignKey
ALTER TABLE "_IncidentNameToIncidentReason" DROP CONSTRAINT "_IncidentNameToIncidentReason_B_fkey";

-- DropForeignKey
ALTER TABLE "_IncidentNameToIncidentSolution" DROP CONSTRAINT "_IncidentNameToIncidentSolution_A_fkey";

-- DropForeignKey
ALTER TABLE "_IncidentNameToIncidentSolution" DROP CONSTRAINT "_IncidentNameToIncidentSolution_B_fkey";

-- DropTable
DROP TABLE "IncidentInfo";

-- DropTable
DROP TABLE "IncidentSolution";

-- DropTable
DROP TABLE "_IncidentNameToIncidentReason";

-- DropTable
DROP TABLE "_IncidentNameToIncidentSolution";

-- CreateTable
CREATE TABLE "IncidentInfo" (
    "id" SERIAL NOT NULL,
    "type" "IncidentInfoType" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IncidentInfoToIncidentName" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IncidentInfoToIncidentName_AB_unique" ON "_IncidentInfoToIncidentName"("A", "B");

-- CreateIndex
CREATE INDEX "_IncidentInfoToIncidentName_B_index" ON "_IncidentInfoToIncidentName"("B");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentReasonId_fkey" FOREIGN KEY ("incidentReasonId") REFERENCES "IncidentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentSolutionId_fkey" FOREIGN KEY ("incidentSolutionId") REFERENCES "IncidentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentInfoToIncidentName" ADD CONSTRAINT "_IncidentInfoToIncidentName_A_fkey" FOREIGN KEY ("A") REFERENCES "IncidentInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentInfoToIncidentName" ADD CONSTRAINT "_IncidentInfoToIncidentName_B_fkey" FOREIGN KEY ("B") REFERENCES "IncidentName"("id") ON DELETE CASCADE ON UPDATE CASCADE;
