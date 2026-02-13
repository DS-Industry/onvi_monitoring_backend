import { TechExpenseReportItem } from "@tech-report/techExpenseReportItem/domain/techExpenseReportItem";

export abstract class ITechExpenseReportItemRepository {
  abstract create(input: TechExpenseReportItem): Promise<TechExpenseReportItem>;
  abstract createMany(input: TechExpenseReportItem[]): void;
  abstract deleteManyByReportId(reportId: number): void;
  abstract findOneById(id: number): Promise<TechExpenseReportItem>;
  abstract findAllByReportId(
    techExpenseReportId: number
  ): Promise<TechExpenseReportItem[]>;
  abstract update(input: TechExpenseReportItem): Promise<TechExpenseReportItem>;
}