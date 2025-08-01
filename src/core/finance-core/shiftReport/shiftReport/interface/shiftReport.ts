import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import {
  DataForCalculationResponseDto
} from "@finance/shiftReport/shiftReport/use-cases/dto/data-for-calculation-response.dto";

export abstract class IShiftReportRepository {
  abstract create(input: ShiftReport): Promise<ShiftReport>;
  abstract findOneById(id: number): Promise<ShiftReport>;
  abstract findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    posId: number,
  ): Promise<ShiftReport[]>;
  abstract findOnePosIdAndWorkerIdAndDate(
    posId: number,
    workerId: number,
    workDate: Date,
  ): Promise<ShiftReport>;
  abstract findLastByStatusSentAndPosId(
    posId: number,
    workDate: Date,
  ): Promise<ShiftReport>;
  abstract findAllForCalculation(
    dateStart: Date,
    dateEnd: Date,
    workerIds: number[],
  ): Promise<DataForCalculationResponseDto[]>;
  abstract update(input: ShiftReport): Promise<ShiftReport>;
}
