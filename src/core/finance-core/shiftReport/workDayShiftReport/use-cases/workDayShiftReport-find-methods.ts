import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';

@Injectable()
export class FindMethodsWorkDayShiftReportUseCase {
  constructor(
    private readonly workDayShiftReportRepository: IWorkDayShiftReportRepository,
  ) {}

  async getOneById(id: number): Promise<WorkDayShiftReport> {
    return await this.workDayShiftReportRepository.findOneById(id);
  }

  async getOneByFilter(
    shiftReportId: number,
    workerId: number,
    workDate: Date,
  ): Promise<WorkDayShiftReport> {
    return await this.workDayShiftReportRepository.findOneByShiftIdAndWorkerIdAndDate(
      shiftReportId,
      workerId,
      workDate,
    );
  }

  async getAllByShiftReportId(
    shiftReportId: number,
  ): Promise<WorkDayShiftReport[]> {
    return await this.workDayShiftReportRepository.findAllByShiftReportId(
      shiftReportId,
    );
  }
}
