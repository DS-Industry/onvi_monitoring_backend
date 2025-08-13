-- CreateTable
CREATE TABLE "ProgramTechRate" (
    "id" SERIAL NOT NULL,
    "carWashPosId" INTEGER NOT NULL,
    "carWashDeviceProgramsTypeId" INTEGER NOT NULL,
    "literRate" INTEGER NOT NULL,
    "concentration" INTEGER NOT NULL,

    CONSTRAINT "ProgramTechRate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgramTechRate" ADD CONSTRAINT "ProgramTechRate_carWashPosId_fkey" FOREIGN KEY ("carWashPosId") REFERENCES "CarWashPos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTechRate" ADD CONSTRAINT "ProgramTechRate_carWashDeviceProgramsTypeId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
