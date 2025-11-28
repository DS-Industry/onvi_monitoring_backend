import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';

export abstract class IShiftGradingRepository {
  abstract createMany(input: ShiftGrading[]): Promise<void>;
  abstract findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<ShiftGrading[]>;
  abstract updateMany(input: ShiftGrading[]): Promise<void>;
}
