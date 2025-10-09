-- AlterTable
ALTER TABLE "HrPayment" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "virtualSum" INTEGER DEFAULT 0;
