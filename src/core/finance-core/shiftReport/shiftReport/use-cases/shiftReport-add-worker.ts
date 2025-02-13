import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import {
  ShiftReportResponseDto,
} from '@platform-user/core-controller/dto/response/shift-report-response.dto';
import { GetOneFullShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-one-full';

@Injectable()
export class AddWorkerShiftReportUseCase {
  constructor(
    private readonly shiftReportRepository: IShiftReportRepository,
    private readonly getOneFullShiftReportUseCase: GetOneFullShiftReportUseCase,
  ) {}

  async execute(
    shiftReportId: number,
    userId: number,
  ): Promise<ShiftReportResponseDto> {
    const shiftReport = await this.shiftReportRepository.addWorker(
      shiftReportId,
      userId,
    );
    return await this.getOneFullShiftReportUseCase.execute(shiftReport);
  }
}
