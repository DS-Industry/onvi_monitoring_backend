/*
  Warnings:

  - You are about to drop the column `city` on the `Placement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "lat" SET DATA TYPE TEXT,
ALTER COLUMN "lon" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Placement" DROP COLUMN "city";
