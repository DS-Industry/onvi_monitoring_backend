import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { User } from '@platform-user/user/domain/user';
import { ShiftReportUpdateDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-update.dto';

@Injectable()
export class UpdateShiftReportUseCase {
  constructor(private readonly shiftReportRepository: IShiftReportRepository) {}

  async execute(
    input: ShiftReportUpdateDto,
    oldShiftReport: ShiftReport,
    user: User,
  ): Promise<ShiftReport> {
    const { startDate, endDate } = input;

    oldShiftReport.startDate = startDate ? startDate : oldShiftReport.startDate;
    oldShiftReport.endDate = endDate ? endDate : oldShiftReport.endDate;

    oldShiftReport.updatedAt = new Date(Date.now());
    oldShiftReport.updatedById = user.id;
    return await this.shiftReportRepository.update(oldShiftReport);
  }
}
