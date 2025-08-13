/*
  Warnings:

  - You are about to drop the column `mobileUserRoleId` on the `LTYUser` table. All the data in the column will be lost.
  - You are about to drop the `MobileUserPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MobileUserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MobileUserPermissionToMobileUserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LTYUser" DROP CONSTRAINT "LTYUser_mobileUserRoleId_fkey";

-- DropForeignKey
ALTER TABLE "_MobileUserPermissionToMobileUserRole" DROP CONSTRAINT "_MobileUserPermissionToMobileUserRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_MobileUserPermissionToMobileUserRole" DROP CONSTRAINT "_MobileUserPermissionToMobileUserRole_B_fkey";

-- DropForeignKey
ALTER TABLE "_Worker" DROP CONSTRAINT "_Worker_A_fkey";

-- DropForeignKey
ALTER TABLE "_Worker" DROP CONSTRAINT "_Worker_B_fkey";

-- AlterTable
ALTER TABLE "LTYUser" DROP COLUMN "mobileUserRoleId",
ADD COLUMN     "workerCorporateId" INTEGER;

-- DropTable
DROP TABLE "MobileUserPermission";

-- DropTable
DROP TABLE "MobileUserRole";

-- DropTable
DROP TABLE "_MobileUserPermissionToMobileUserRole";

-- DropTable
DROP TABLE "_Worker";

-- AddForeignKey
ALTER TABLE "LTYUser" ADD CONSTRAINT "LTYUser_workerCorporateId_fkey" FOREIGN KEY ("workerCorporateId") REFERENCES "LTYCorporate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
