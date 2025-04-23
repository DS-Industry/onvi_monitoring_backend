-- CreateEnum
CREATE TYPE "StatusReportTemplate" AS ENUM ('PROGRESS', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "ReportTemplateTransaction" (
    "id" SERIAL NOT NULL,
    "reportTemplateId" INTEGER,
    "userId" INTEGER NOT NULL,
    "reposrtKey" TEXT,
    "startTemplateAt" TIMESTAMP(3) NOT NULL,
    "endTemplateAt" TIMESTAMP(3),
    "status" "StatusReportTemplate" NOT NULL,

    CONSTRAINT "ReportTemplateTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportTemplateTransaction" ADD CONSTRAINT "ReportTemplateTransaction_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplateTransaction" ADD CONSTRAINT "ReportTemplateTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
