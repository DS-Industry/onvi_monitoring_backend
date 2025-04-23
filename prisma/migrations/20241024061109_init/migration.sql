-- CreateEnum
CREATE TYPE "TypeTechTask" AS ENUM ('Routine', 'Regulation');

-- CreateEnum
CREATE TYPE "StatusTechTask" AS ENUM ('ACTIVE', 'FINISHED', 'PAUSE');

-- CreateEnum
CREATE TYPE "PeriodTechTask" AS ENUM ('Daily', 'Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "TypeTechTaskItemTemplate" AS ENUM ('Text', 'Number', 'SelectList', 'Checkbox');

-- CreateEnum
CREATE TYPE "GroupTechTaskItemTemplate" AS ENUM ('Check', 'PowerConsumption', 'Installations', 'Softener', 'Osmosis', 'CarbonFilter', 'Chemistry', 'Counters');

-- CreateTable
CREATE TABLE "TechTask" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "posId" INTEGER NOT NULL,
    "type" "TypeTechTask" NOT NULL,
    "status" "StatusTechTask" NOT NULL,
    "period" "PeriodTechTask" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startWorkDate" TIMESTAMP(3),
    "sendWorkDate" TIMESTAMP(3),
    "executorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updateById" INTEGER NOT NULL,

    CONSTRAINT "TechTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechTaskItemTemplate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TypeTechTaskItemTemplate" NOT NULL,
    "group" "GroupTechTaskItemTemplate" NOT NULL,

    CONSTRAINT "TechTaskItemTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechTaskItemValueToTechTask" (
    "id" SERIAL NOT NULL,
    "techTaskId" INTEGER NOT NULL,
    "techTaskItemTemplateId" INTEGER NOT NULL,
    "value" TEXT,

    CONSTRAINT "TechTaskItemValueToTechTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TechTask" ADD CONSTRAINT "TechTask_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechTask" ADD CONSTRAINT "TechTask_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechTask" ADD CONSTRAINT "TechTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechTask" ADD CONSTRAINT "TechTask_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechTaskItemValueToTechTask" ADD CONSTRAINT "TechTaskItemValueToTechTask_techTaskId_fkey" FOREIGN KEY ("techTaskId") REFERENCES "TechTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechTaskItemValueToTechTask" ADD CONSTRAINT "TechTaskItemValueToTechTask_techTaskItemTemplateId_fkey" FOREIGN KEY ("techTaskItemTemplateId") REFERENCES "TechTaskItemTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
