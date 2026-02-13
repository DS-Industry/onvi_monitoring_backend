import { TechExpenseReport } from "@tech-report/techExpenseReport/domain/techExpenseReport";
import { TechExpenseReportStatus } from "@prisma/client";

export abstract class ITechExpenseReportRepository {
  abstract create(input: TechExpenseReport): Promise<TechExpenseReport>;
  abstract findOneById(id: number): Promise<TechExpenseReport>;
  abstract findAllByFilter(
    userId?: number,
    posId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    status?: TechExpenseReportStatus,
    skip?: number,
    take?: number,
    ): Promise<TechExpenseReport[]>;
  abstract countAllByFilter(
    userId?: number,
    posId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    status?: TechExpenseReportStatus
  ): Promise<number>;
  abstract update(input: TechExpenseReport): Promise<TechExpenseReport>;
  abstract delete(id: number): Promise<void>;
}