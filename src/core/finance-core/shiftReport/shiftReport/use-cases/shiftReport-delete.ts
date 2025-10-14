import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';

@Injectable()
export class DeleteShiftReportUseCase {
  constructor(
    private readonly shiftReportRepository: IShiftReportRepository,
  ) {}

  async execute(shiftReport: ShiftReport): Promise<void> {
    await this.shiftReportRepository.delete(shiftReport.id);
  }
}
