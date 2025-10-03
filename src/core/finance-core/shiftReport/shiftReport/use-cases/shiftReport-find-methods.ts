import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { DataForCalculationResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/data-for-calculation-response.dto';

@Injectable()
export class FindMethodsShiftReportUseCase {
  constructor(private readonly shiftReportRepository: IShiftReportRepository) {}

  async getOneById(id: number): Promise<ShiftReport> {
    return await this.shiftReportRepository.findOneById(id);
  }

  async getAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    posId: number,
  ): Promise<ShiftReport[]> {
    return await this.shiftReportRepository.findAllByFilter(
      dateStart,
      dateEnd,
      posId,
    );
  }
  async getOneWorkerIdAndDate(
    posId: number,
    workerId: number,
    workDate: Date,
  ): Promise<ShiftReport> {
    return await this.shiftReportRepository.findOnePosIdAndWorkerIdAndDate(
      posId,
      workerId,
      workDate,
    );
  }
  async getLastByStatusSentAndPosId(
    posId: number,
    workDate: Date,
  ): Promise<ShiftReport> {
    return await this.shiftReportRepository.findLastByStatusSentAndPosId(
      posId,
      workDate,
    );
  }
  async getDataForCalculation(
    dateStart: Date,
    dateEnd: Date,
    workerIds: number[],
  ): Promise<DataForCalculationResponseDto[]> {
    return await this.shiftReportRepository.findAllForCalculation(
      dateStart,
      dateEnd,
      workerIds,
    );
  }
  
  async getShiftReportsWithPayout(
    dateStart: Date,
    dateEnd: Date,
    workerIds: number[],
  ): Promise<ShiftReport[]> {
    return await this.shiftReportRepository.findAllWithPayoutForCalculation(
      dateStart,
      dateEnd,
      workerIds,
    );
  }
}
