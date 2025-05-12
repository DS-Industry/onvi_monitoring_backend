import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReportCreateDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-create.dto';
import { User } from '@platform-user/user/domain/user';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';

@Injectable()
export class CreateShiftReportUseCase {
  constructor(private readonly shiftReportRepository: IShiftReportRepository) {}

  async execute(data: ShiftReportCreateDto, user: User): Promise<ShiftReport> {
    const shiftReportData = new ShiftReport({
      posId: data.posId,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    return await this.shiftReportRepository.create(shiftReportData);
  }
}
