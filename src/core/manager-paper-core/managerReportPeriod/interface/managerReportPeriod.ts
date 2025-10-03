import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { ManagerReportPeriodStatus } from '@prisma/client';

export abstract class IManagerReportPeriodRepository {
  abstract create(input: ManagerReportPeriod): Promise<ManagerReportPeriod>;
  abstract findOneById(id: number): Promise<ManagerReportPeriod>;
  abstract findAllByFilter(
    status?: ManagerReportPeriodStatus,
    dateStartPeriod?: Date,
    dateEndPeriod?: Date,
    userId?: number,
    skip?: number,
    take?: number,
  ): Promise<ManagerReportPeriod[]>;
  abstract countAllByFilter(
    status?: ManagerReportPeriodStatus,
    dateStartPeriod?: Date,
    dateEndPeriod?: Date,
    userId?: number,
  ): Promise<number>;
  abstract update(input: ManagerReportPeriod): Promise<ManagerReportPeriod>;
  abstract delete(id: number): Promise<void>;
  abstract findByDateAndUser(eventDate: Date, userId: number): Promise<ManagerReportPeriod | null>;
}
