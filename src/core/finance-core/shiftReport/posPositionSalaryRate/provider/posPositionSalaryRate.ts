import { Provider } from '@nestjs/common';
import { IPosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/interface/posPositionSalaryRate';
import { PosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/repository/posPositionSalaryRate';

export const PosPositionSalaryRateRepositoryProvider: Provider = {
  provide: IPosPositionSalaryRateRepository,
  useClass: PosPositionSalaryRateRepository,
};

