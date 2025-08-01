import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

export abstract class IShiftReportCashOperRepository {
  abstract create(input: ShiftReportCashOper): Promise<ShiftReportCashOper>;
  abstract findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<ShiftReportCashOper[]>;
  abstract findAllByShiftReportIdAndType(
    shiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<ShiftReportCashOper[]>;
}
