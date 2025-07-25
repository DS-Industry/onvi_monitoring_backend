import {
  ManagerReportPeriod as PrismaManagerReportPeriod,
  Prisma,
} from '@prisma/client';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';

export class PrismaManagerReportPeriodMapper {
  static toDomain(entity: PrismaManagerReportPeriod): ManagerReportPeriod {
    if (!entity) {
      return null;
    }
    return new ManagerReportPeriod({
      id: entity.id,
      status: entity.status,
      startPeriod: entity.startPeriod,
      endPeriod: entity.endPeriod,
      sumStartPeriod: entity.sumStartPeriod,
      sumEndPeriod: entity.sumEndPeriod,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    managerReportPeriod: ManagerReportPeriod,
  ): Prisma.ManagerReportPeriodUncheckedCreateInput {
    return {
      id: managerReportPeriod?.id,
      status: managerReportPeriod.status,
      startPeriod: managerReportPeriod.startPeriod,
      endPeriod: managerReportPeriod.endPeriod,
      sumStartPeriod: managerReportPeriod.sumStartPeriod,
      sumEndPeriod: managerReportPeriod.sumEndPeriod,
      userId: managerReportPeriod.userId,
      createdAt: managerReportPeriod.createdAt,
      updatedAt: managerReportPeriod.updatedAt,
      createdById: managerReportPeriod?.createdById,
      updatedById: managerReportPeriod?.updatedById,
    };
  }
}
