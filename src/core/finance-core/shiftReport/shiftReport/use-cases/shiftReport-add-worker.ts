import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import {
  ShiftReportResponseDto,
  WorkerShiftReportDto,
} from '@platform-user/core-controller/dto/response/shift-report-response.dto';

@Injectable()
export class AddWorkerShiftReportUseCase {
  constructor(
    private readonly shiftReportRepository: IShiftReportRepository,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
  ) {}

  async execute(
    shiftReportId: number,
    userId: number,
  ): Promise<ShiftReportResponseDto> {
    const shiftReport = await this.shiftReportRepository.addWorker(
      shiftReportId,
      userId,
    );
    const workers = await this.findMethodsShiftReportUseCase.getAllWorkerById(
      shiftReport.id,
    );

    const workerData: WorkerShiftReportDto[] = workers.map((worker) => ({
      workerId: worker.id,
      name: worker.name,
      surname: worker.surname,
      middlename: worker.middlename || '',
      position: worker.position,
    }));
    return {
      id: shiftReport.id,
      posId: shiftReport.posId!,
      startDate: shiftReport.startDate,
      endDate: shiftReport.endDate,
      workers: workerData,
    };
  }
}
