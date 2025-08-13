-- AlterTable
ALTER TABLE "ManagerPaper" ADD COLUMN     "cashCollectionId" INTEGER;

-- AddForeignKey
ALTER TABLE "ManagerPaper" ADD CONSTRAINT "ManagerPaper_cashCollectionId_fkey" FOREIGN KEY ("cashCollectionId") REFERENCES "CashCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
