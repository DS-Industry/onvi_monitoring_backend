import { Injectable } from '@nestjs/common';
import { IReportTemplateRepository } from '@report/report/interface/reportTemplate';
import { ReportTemplate } from '@report/report/domain/reportTemplate';
import { CategoryReportTemplate } from '@prisma/client';

@Injectable()
export class FindMethodsReportUseCase {
  constructor(
    private readonly reportTemplateRepository: IReportTemplateRepository,
  ) {}

  async getOneById(id: number): Promise<ReportTemplate> {
    return await this.reportTemplateRepository.findOneById(id);
  }

  async getAll(skip?: number, take?: number): Promise<ReportTemplate[]> {
    return await this.reportTemplateRepository.findAll(skip, take);
  }

  async getCountAll(): Promise<number> {
    return await this.reportTemplateRepository.countAll();
  }

  async getAllByCategory(
    category: CategoryReportTemplate,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplate[]> {
    return await this.reportTemplateRepository.findAllByCategory(
      category,
      skip,
      take,
    );
  }

  async getCountAllByCategory(
    category: CategoryReportTemplate,
  ): Promise<number> {
    return await this.reportTemplateRepository.countAllByCategory(category);
  }
}
