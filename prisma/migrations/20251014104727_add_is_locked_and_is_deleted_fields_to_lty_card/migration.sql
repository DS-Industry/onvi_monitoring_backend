-- AlterTable
ALTER TABLE "LTYCard" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "isLocked" BOOLEAN DEFAULT false;
