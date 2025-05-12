import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';

export abstract class IWorkDayShiftReportRepository {
  abstract create(input: WorkDayShiftReport): Promise<WorkDayShiftReport>;
  abstract findOneById(id: number): Promise<WorkDayShiftReport>;
  abstract findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<WorkDayShiftReport[]>;
  abstract findOneByShiftIdAndWorkerIdAndDate(
    shiftReportId: number,
    workerId: number,
    workDate: Date,
  ): Promise<WorkDayShiftReport>;
  abstract findLastByStatusSentAndPosId(
    posId: number,
    workDate: Date,
  ): Promise<WorkDayShiftReport>;
  abstract update(input: WorkDayShiftReport): Promise<WorkDayShiftReport>;
}
