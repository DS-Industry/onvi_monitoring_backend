-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_incidentReasonId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_incidentSolutionId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_workerId_fkey";

-- AlterTable
ALTER TABLE "Incident" ALTER COLUMN "workerId" DROP NOT NULL,
ALTER COLUMN "incidentReasonId" DROP NOT NULL,
ALTER COLUMN "incidentSolutionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentReasonId_fkey" FOREIGN KEY ("incidentReasonId") REFERENCES "IncidentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incidentSolutionId_fkey" FOREIGN KEY ("incidentSolutionId") REFERENCES "IncidentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
