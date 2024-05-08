-- DropForeignKey
ALTER TABLE "MobileUser" DROP CONSTRAINT "MobileUser_loyaltyCardId_fkey";

-- DropForeignKey
ALTER TABLE "MobileUser" DROP CONSTRAINT "MobileUser_mobileUserRoleId_fkey";

-- AlterTable
ALTER TABLE "MobileUser" ALTER COLUMN "loyaltyCardId" DROP NOT NULL,
ALTER COLUMN "mobileUserRoleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_loyaltyCardId_fkey" FOREIGN KEY ("loyaltyCardId") REFERENCES "LoyaltyCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_mobileUserRoleId_fkey" FOREIGN KEY ("mobileUserRoleId") REFERENCES "MobileUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
