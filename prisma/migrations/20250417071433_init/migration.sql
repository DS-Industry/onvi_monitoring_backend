-- DropForeignKey
ALTER TABLE "HrPayment" DROP CONSTRAINT "HrPayment_updatedById_fkey";

-- AlterTable
ALTER TABLE "HrPayment" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HrPayment" ADD CONSTRAINT "HrPayment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
