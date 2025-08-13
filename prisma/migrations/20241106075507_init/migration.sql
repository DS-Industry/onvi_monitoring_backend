-- DropForeignKey
ALTER TABLE "TechTask" DROP CONSTRAINT "TechTask_posId_fkey";

-- AlterTable
ALTER TABLE "TechTask" ALTER COLUMN "posId" DROP NOT NULL,
ALTER COLUMN "nextCreateDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TechTask" ADD CONSTRAINT "TechTask_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
