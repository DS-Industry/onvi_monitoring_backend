-- CreateEnum
CREATE TYPE "NomenclatureStatus" AS ENUM ('ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "Nomenclature" ADD COLUMN     "status" "NomenclatureStatus" DEFAULT 'ACTIVE';
