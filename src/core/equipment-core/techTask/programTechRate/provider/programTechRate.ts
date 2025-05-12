import { Provider } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import { ProgramTechRateRepository } from '@tech-task/programTechRate/repository/programTechRate';

export const ProgramTechRateProvider: Provider = {
  provide: IProgramTechRateRepository,
  useClass: ProgramTechRateRepository,
};
