-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "apperanceDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3) NOT NULL,
    "deviceIncident" TEXT NOT NULL,
    "carWashDeviceId" INTEGER,
    "equipmentKnotId" INTEGER,
    "equipmentId" INTEGER,
    "incidentReasonId" INTEGER NOT NULL,
    "incidentSolutionId" INTEGER NOT NULL,
    "downtime" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "carWashDeviceProgramsTypeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updateById" INTEGER NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentKnot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EquipmentKnot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentSolution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentKnotToPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EquipmentToEquipmentKnot" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentKnotToPos_AB_unique" ON "_EquipmentKnotToPos"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentKnotToPos_B_index" ON "_EquipmentKnotToPos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentToEquipmentKnot_AB_unique" ON "_EquipmentToEquipmentKnot"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentToEquipmentKnot_B_index" ON "_EquipmentToEquipmentKnot"("B");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_equipmentKnotId_fkey" FOREIGN KEY ("equipmentKnotId") REFERENCES "EquipmentKnot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "IncidentName"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentReasonId_fkey" FOREIGN KEY ("incidentReasonId") REFERENCES "IncidentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentSolutionId_fkey" FOREIGN KEY ("incidentSolutionId") REFERENCES "IncidentSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_carWashDeviceProgramsTypeId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToPos" ADD CONSTRAINT "_EquipmentKnotToPos_A_fkey" FOREIGN KEY ("A") REFERENCES "EquipmentKnot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentKnotToPos" ADD CONSTRAINT "_EquipmentKnotToPos_B_fkey" FOREIGN KEY ("B") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToEquipmentKnot" ADD CONSTRAINT "_EquipmentToEquipmentKnot_A_fkey" FOREIGN KEY ("A") REFERENCES "IncidentName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToEquipmentKnot" ADD CONSTRAINT "_EquipmentToEquipmentKnot_B_fkey" FOREIGN KEY ("B") REFERENCES "EquipmentKnot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
