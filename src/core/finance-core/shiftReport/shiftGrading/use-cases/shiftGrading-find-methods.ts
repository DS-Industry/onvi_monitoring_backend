import { Injectable } from '@nestjs/common';
import { IShiftGradingRepository } from '@finance/shiftReport/shiftGrading/interface/shiftGrading';
import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';

@Injectable()
export class FindMethodsShiftGradingUseCase {
  constructor(
    private readonly shiftGradingRepository: IShiftGradingRepository,
  ) {}

  async getAllByShiftReportId(shiftReportId: number): Promise<ShiftGrading[]> {
    return await this.shiftGradingRepository.findAllByShiftReportId(
      shiftReportId,
    );
  }
}
