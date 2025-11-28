import { Provider } from '@nestjs/common';
import { IShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/interface/shiftReportCashOper';
import { ShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/repository/shiftReportCashOper';

export const ShiftReportCashOperRepositoryProvider: Provider = {
  provide: IShiftReportCashOperRepository,
  useClass: ShiftReportCashOperRepository,
};
