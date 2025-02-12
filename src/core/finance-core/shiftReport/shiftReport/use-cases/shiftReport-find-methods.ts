import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FindMethodsShiftReportUseCase {
  constructor(private readonly shiftReportRepository: IShiftReportRepository) {}

  async getOneById(id: number): Promise<ShiftReport> {
    return await this.shiftReportRepository.findOneById(id);
  }

  async getAllWorkerById(id: number): Promise<User[]> {
    return await this.shiftReportRepository.findAllWorkerById(id);
  }

  async getAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<ShiftReport[]> {
    return await this.shiftReportRepository.findAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
      skip,
      take,
    );
  }

  async getCountAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return await this.shiftReportRepository.countAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
    );
  }
}
