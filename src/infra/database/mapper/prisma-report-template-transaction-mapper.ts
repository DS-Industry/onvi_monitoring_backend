import {
  ReportTemplateTransaction as PrismaReportTemplateTransaction,
  Prisma,
} from '@prisma/client';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';

export class PrismaReportTemplateTransactionMapper {
  static toDomain(
    entity: PrismaReportTemplateTransaction,
  ): ReportTemplateTransaction {
    if (!entity) {
      return null;
    }
    return new ReportTemplateTransaction({
      id: entity.id,
      reportTemplateId: entity.reportTemplateId,
      userId: entity.userId,
      reportKey: entity.reportKey,
      startTemplateAt: entity.startTemplateAt,
      endTemplateAt: entity.endTemplateAt,
      status: entity.status,
    });
  }

  static toPrisma(
    reportTemplateTransaction: ReportTemplateTransaction,
  ): Prisma.ReportTemplateTransactionUncheckedCreateInput {
    return {
      id: reportTemplateTransaction?.id,
      reportTemplateId: reportTemplateTransaction.reportTemplateId,
      userId: reportTemplateTransaction.userId,
      reportKey: reportTemplateTransaction?.reportKey,
      startTemplateAt: reportTemplateTransaction.startTemplateAt,
      endTemplateAt: reportTemplateTransaction?.endTemplateAt,
      status: reportTemplateTransaction.status,
    };
  }
}
