-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_posId_fkey";

-- AlterTable
ALTER TABLE "Incident" ALTER COLUMN "posId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
