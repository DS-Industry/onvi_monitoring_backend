import { Injectable } from '@nestjs/common';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { FindMethodsWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-find-methods';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import {
  ShiftReportResponseDto,
  WorkerShiftReportDto,
} from '@platform-user/core-controller/dto/response/shift-report-response.dto';

@Injectable()
export class GetOneFullShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly findMethodsWorkDayShiftReportUseCase: FindMethodsWorkDayShiftReportUseCase,
  ) {}

  async execute(shiftReport: ShiftReport): Promise<ShiftReportResponseDto> {
    const workers = await this.findMethodsShiftReportUseCase.getAllWorkerById(
      shiftReport.id,
    );
    const workDayShiftReports =
      await this.findMethodsWorkDayShiftReportUseCase.getAllByShiftReportId(
        shiftReport.id,
      );

    const workerData: WorkerShiftReportDto[] = workers.map((worker) => {
      const workerWorkDays = workDayShiftReports
        .filter((workDay) => workDay.workerId === worker.id)
        .map((workDay) => ({
          workDayId: workDay.id,
          workDate: workDay.workDate,
          typeWorkDay: workDay.typeWorkDay,
          timeWorkedOut: workDay?.timeWorkedOut,
          prize: workDay?.prize,
          fine: workDay?.fine,
        }));

      return {
        workerId: worker.id,
        name: worker.name,
        surname: worker.surname,
        middlename: worker?.middlename,
        position: worker.position,
        workDays: workerWorkDays,
      };
    });
    return {
      id: shiftReport.id,
      posId: shiftReport.posId!,
      startDate: shiftReport.startDate,
      endDate: shiftReport.endDate,
      workers: workerData,
    };
  }
}
