import { Provider } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { IncidentRepository } from '@equipment/incident/incident/repository/incident';

export const IncidentRepositoryProvider: Provider = {
  provide: IIncidentRepository,
  useClass: IncidentRepository,
};
