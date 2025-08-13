-- CreateTable
CREATE TABLE "ProgramChange" (
    "id" SERIAL NOT NULL,
    "carWashPosId" INTEGER NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "carWashDeviceProgramsTypeFromId" INTEGER NOT NULL,
    "carWashDeviceProgramsTypeToId" INTEGER NOT NULL,

    CONSTRAINT "ProgramChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgramChange" ADD CONSTRAINT "ProgramChange_carWashPosId_fkey" FOREIGN KEY ("carWashPosId") REFERENCES "CarWashPos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramChange" ADD CONSTRAINT "ProgramChange_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramChange" ADD CONSTRAINT "ProgramChange_carWashDeviceProgramsTypeFromId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeFromId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramChange" ADD CONSTRAINT "ProgramChange_carWashDeviceProgramsTypeToId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeToId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
