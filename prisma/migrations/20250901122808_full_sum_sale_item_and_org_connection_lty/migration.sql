/*
  Warnings:

  - You are about to drop the column `ltyProgramId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ltyProgramId_fkey";

-- AlterTable
ALTER TABLE "MNGSaleItem" ADD COLUMN     "fullSum" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "ltyProgramId";

-- CreateTable
CREATE TABLE "_LTYProgramToOrganization" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LTYProgramToOrganization_AB_unique" ON "_LTYProgramToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_LTYProgramToOrganization_B_index" ON "_LTYProgramToOrganization"("B");

-- AddForeignKey
ALTER TABLE "_LTYProgramToOrganization" ADD CONSTRAINT "_LTYProgramToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LTYProgramToOrganization" ADD CONSTRAINT "_LTYProgramToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
