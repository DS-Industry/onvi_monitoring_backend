-- DropForeignKey
ALTER TABLE "PlatformUser" DROP CONSTRAINT "PlatformUser_platformUserRoleId_fkey";

-- AlterTable
ALTER TABLE "MobileUser" ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "middlename" DROP NOT NULL,
ALTER COLUMN "birthday" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "refreshTokenId" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlatformUser" ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "middlename" DROP NOT NULL,
ALTER COLUMN "birthday" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "refreshTokenId" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "platformUserRoleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PlatformUser" ADD CONSTRAINT "PlatformUser_platformUserRoleId_fkey" FOREIGN KEY ("platformUserRoleId") REFERENCES "PlatformUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
