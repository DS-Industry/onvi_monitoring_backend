-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "placementId" INTEGER;

-- AlterTable
ALTER TABLE "Pos" ADD COLUMN     "placementId" INTEGER;

-- CreateTable
CREATE TABLE "Placement" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "utc" TEXT NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
