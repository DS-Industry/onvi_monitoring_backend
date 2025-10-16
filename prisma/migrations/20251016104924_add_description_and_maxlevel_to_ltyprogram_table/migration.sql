-- AlterTable
ALTER TABLE "LTYProgram" ADD COLUMN     "description" TEXT,
ADD COLUMN     "maxLevels" INTEGER NOT NULL DEFAULT 3;
