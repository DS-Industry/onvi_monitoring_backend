import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';

export abstract class IWorkDayShiftReportRepository {
  abstract create(input: WorkDayShiftReport): Promise<WorkDayShiftReport>;
  abstract findOneById(id: number): Promise<WorkDayShiftReport>;
  abstract findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<WorkDayShiftReport[]>;
  abstract update(input: WorkDayShiftReport): Promise<WorkDayShiftReport>;
}
