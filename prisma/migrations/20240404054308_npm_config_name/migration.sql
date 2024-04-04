/*
  Warnings:

  - The `status` column on the `PlatformUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusPlatformAdmin" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "PlatformUser" DROP COLUMN "status",
ADD COLUMN     "status" "StatusPlatformAdmin" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "PlatformAdminStatus";
