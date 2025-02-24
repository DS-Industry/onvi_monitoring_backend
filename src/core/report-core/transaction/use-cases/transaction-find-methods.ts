import { Injectable } from '@nestjs/common';
import { IReportTemplateTransactionRepository } from '@report/transaction/interface/reportTemplateTransaction';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';

@Injectable()
export class FindMethodsTransactionUseCase {
  constructor(
    private readonly reportTemplateTransactionRepository: IReportTemplateTransactionRepository,
  ) {}

  async getAllByUserId(
    userId: number,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplateTransaction[]> {
    return await this.reportTemplateTransactionRepository.findAllByUserId(
      userId,
      skip,
      take,
    );
  }

  async getCountAllByUserId(userId: number): Promise<number> {
    return await this.reportTemplateTransactionRepository.countAllByUserId(
      userId,
    );
  }
}
