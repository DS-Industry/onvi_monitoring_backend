import { ReportTemplate as PrismaReportTemplate, Prisma } from '@prisma/client';
import { ReportTemplate } from '@report/report/domain/reportTemplate';

export class PrismaReportTemplateMapper {
  static toDomain(entity: PrismaReportTemplate): ReportTemplate {
    if (!entity) {
      return null;
    }
    let params = undefined;

    if (typeof entity.params === 'object' && entity.params !== null) {
      params = entity.params;
    } else if (typeof entity.params === 'string') {
      try {
        params = JSON.parse(entity.params);
      } catch (error) {
        params = undefined;
      }
    }

    return new ReportTemplate({
      id: entity.id,
      name: entity.name,
      category: entity.category,
      description: entity.description,
      query: entity.query,
      params: params,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(
    reportTemplate: ReportTemplate,
  ): Prisma.ReportTemplateUncheckedCreateInput {
    return {
      id: reportTemplate?.id,
      name: reportTemplate.name,
      category: reportTemplate.category,
      description: reportTemplate?.description,
      query: reportTemplate.query,
      params: reportTemplate.params
        ? JSON.stringify(reportTemplate.params)
        : null,
      createdAt: reportTemplate?.createdAt,
      updatedAt: reportTemplate?.updatedAt,
    };
  }
}
