/*
  Warnings:

  - You are about to drop the column `reposrtKey` on the `ReportTemplateTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReportTemplateTransaction" DROP COLUMN "reposrtKey",
ADD COLUMN     "reportKey" TEXT;
