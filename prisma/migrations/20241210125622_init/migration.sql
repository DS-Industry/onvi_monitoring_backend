-- CreateEnum
CREATE TYPE "MeasurementNomenclature" AS ENUM ('PIECE', 'KILOGRAM', 'LITER', 'METER');

-- AlterTable
ALTER TABLE "Nomenclature" ADD COLUMN     "measurement" "MeasurementNomenclature";
