/*
  Warnings:

  - You are about to drop the `_OrganizationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_B_fkey";

-- DropTable
DROP TABLE "_OrganizationToUser";

-- CreateTable
CREATE TABLE "_UserOrg" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserOrg_AB_unique" ON "_UserOrg"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOrg_B_index" ON "_UserOrg"("B");

-- AddForeignKey
ALTER TABLE "_UserOrg" ADD CONSTRAINT "_UserOrg_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrg" ADD CONSTRAINT "_UserOrg_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
