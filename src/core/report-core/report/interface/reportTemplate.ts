import { ReportTemplate } from '@report/report/domain/reportTemplate';
import { CategoryReportTemplate } from '@prisma/client';

export abstract class IReportTemplateRepository {
  abstract findOneById(id: number): Promise<ReportTemplate>;
  abstract findAll(skip?: number, take?: number): Promise<ReportTemplate[]>;
  abstract countAll(): Promise<number>;
  abstract findAllByCategory(
    category: CategoryReportTemplate,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplate[]>;
  abstract countAllByCategory(
    category: CategoryReportTemplate,
  ): Promise<number>;
  abstract apply(paramsArray: any[], query: string): Promise<any>;
}
