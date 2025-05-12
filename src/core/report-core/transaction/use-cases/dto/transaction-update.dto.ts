import { StatusReportTemplate } from '@prisma/client';

export class TransactionUpdateDto {
  reportKey?: string;
  status?: StatusReportTemplate;
}
