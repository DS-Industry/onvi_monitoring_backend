import { Provider } from '@nestjs/common';
import { IShiftGradingRepository } from '@finance/shiftReport/shiftGrading/interface/shiftGrading';
import { ShiftGradingRepository } from '@finance/shiftReport/shiftGrading/repository/shiftGrading';

export const ShiftGradingRepositoryProvider: Provider = {
  provide: IShiftGradingRepository,
  useClass: ShiftGradingRepository,
};
