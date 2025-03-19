import { Injectable } from '@nestjs/common';
import { IReportTemplateTransactionRepository } from '@report/transaction/interface/reportTemplateTransaction';
import { PrismaService } from '@db/prisma/prisma.service';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';
import { PrismaReportTemplateTransactionMapper } from '@db/mapper/prisma-report-template-transaction-mapper';

@Injectable()
export class ReportTemplateTransactionRepository extends IReportTemplateTransactionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: ReportTemplateTransaction,
  ): Promise<ReportTemplateTransaction> {
    const reportTemplateTransactionEntity =
      PrismaReportTemplateTransactionMapper.toPrisma(input);
    const reportTemplateTransaction =
      await this.prisma.reportTemplateTransaction.create({
        data: reportTemplateTransactionEntity,
      });
    return PrismaReportTemplateTransactionMapper.toDomain(
      reportTemplateTransaction,
    );
  }

  public async findAllByUserId(
    userId: number,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplateTransaction[]> {
    const reportTemplateTransactions =
      await this.prisma.reportTemplateTransaction.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: {
          userId,
        },
        orderBy: {
          startTemplateAt: 'desc',
        },
      });
    return reportTemplateTransactions.map((item) =>
      PrismaReportTemplateTransactionMapper.toDomain(item),
    );
  }

  public async countAllByUserId(userId: number): Promise<number> {
    return this.prisma.reportTemplateTransaction.count({
      where: {
        userId,
      },
    });
  }

  public async update(
    input: ReportTemplateTransaction,
  ): Promise<ReportTemplateTransaction> {
    const reportTemplateTransactionEntity =
      PrismaReportTemplateTransactionMapper.toPrisma(input);
    const reportTemplateTransaction =
      await this.prisma.reportTemplateTransaction.update({
        where: {
          id: input.id,
        },
        data: reportTemplateTransactionEntity,
      });
    return PrismaReportTemplateTransactionMapper.toDomain(
      reportTemplateTransaction,
    );
  }
}
