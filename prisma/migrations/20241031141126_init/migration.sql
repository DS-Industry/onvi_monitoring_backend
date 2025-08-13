/*
  Warnings:

  - A unique constraint covering the columns `[posId]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Incident_posId_key" ON "Incident"("posId");
