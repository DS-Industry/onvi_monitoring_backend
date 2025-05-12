import { Injectable } from '@nestjs/common';
import { IReportTemplateRepository } from '@report/report/interface/reportTemplate';
import { PrismaService } from '@db/prisma/prisma.service';
import { ReportTemplate } from '@report/report/domain/reportTemplate';
import { PrismaReportTemplateMapper } from '@db/mapper/prisma-report-template-mapper';
import { CategoryReportTemplate } from '@prisma/client';

@Injectable()
export class ReportTemplateRepository extends IReportTemplateRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async findOneById(id: number): Promise<ReportTemplate> {
    const reportTemplate = await this.prisma.reportTemplate.findFirst({
      where: {
        id,
      },
    });
    return PrismaReportTemplateMapper.toDomain(reportTemplate);
  }

  public async findAll(
    skip?: number,
    take?: number,
  ): Promise<ReportTemplate[]> {
    const reportTemplates = await this.prisma.reportTemplate.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
    return reportTemplates.map((item) =>
      PrismaReportTemplateMapper.toDomain(item),
    );
  }

  public async countAll(): Promise<number> {
    return this.prisma.reportTemplate.count();
  }

  public async findAllByCategory(
    category: CategoryReportTemplate,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplate[]> {
    const reportTemplates = await this.prisma.reportTemplate.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        category,
      },
    });
    return reportTemplates.map((item) =>
      PrismaReportTemplateMapper.toDomain(item),
    );
  }

  public async countAllByCategory(
    category: CategoryReportTemplate,
  ): Promise<number> {
    return this.prisma.reportTemplate.count({
      where: {
        category,
      },
    });
  }

  public async apply(paramsArray: any[], query: string): Promise<any> {
    return this.prisma.$queryRawUnsafe(query, ...paramsArray);
  }
}
