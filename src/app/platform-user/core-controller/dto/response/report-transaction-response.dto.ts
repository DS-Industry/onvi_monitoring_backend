import { StatusReportTemplate } from '@prisma/client';

export class ReportTransactionResponseDto {
  id: number;
  reportTemplateId: number;
  userId: number;
  startTemplateAt: Date;
  endTemplateAt?: Date;
  status: StatusReportTemplate;
  reportKey?: string;
}
