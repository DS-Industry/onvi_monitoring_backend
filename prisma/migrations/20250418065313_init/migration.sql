/*
  Warnings:

  - The values [Routine,Regulation] on the enum `TypeTechTask` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `period` on the `TechTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeTechTask_new" AS ENUM ('ONETIME', 'REGULAR');
ALTER TABLE "TechTask" ALTER COLUMN "type" TYPE "TypeTechTask_new" USING ("type"::text::"TypeTechTask_new");
ALTER TYPE "TypeTechTask" RENAME TO "TypeTechTask_old";
ALTER TYPE "TypeTechTask_new" RENAME TO "TypeTechTask";
DROP TYPE "TypeTechTask_old";
COMMIT;

-- AlterTable
ALTER TABLE "TechTask" ADD COLUMN     "markdownDescription" TEXT,
DROP COLUMN "period",
ADD COLUMN     "period" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "PeriodTechTask";
