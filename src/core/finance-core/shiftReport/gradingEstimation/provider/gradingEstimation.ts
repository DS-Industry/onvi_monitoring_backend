import { Provider } from '@nestjs/common';
import { IGradingEstimationRepository } from '@finance/shiftReport/gradingEstimation/interface/gradingEstimation';
import { GradingEstimationRepository } from '@finance/shiftReport/gradingEstimation/repository/gradingEstimation';

export const GradingEstimationRepositoryProvider: Provider = {
  provide: IGradingEstimationRepository,
  useClass: GradingEstimationRepository,
};
