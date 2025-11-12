import { CategoryReportTemplate } from '@prisma/client';

export class ReportResponseDto {
  id: number;
  name: string;
  category: CategoryReportTemplate;
  description?: string;
  params: JSON;
}
