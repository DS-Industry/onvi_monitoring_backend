import { Provider } from '@nestjs/common';
import { IGradingParameterRepository } from '@finance/shiftReport/gradingParameter/interface/gradingParameter';
import { GradingParameterRepository } from '@finance/shiftReport/gradingParameter/repository/gradingParameter';

export const GradingParameterRepositoryProvider: Provider = {
  provide: IGradingParameterRepository,
  useClass: GradingParameterRepository,
};
