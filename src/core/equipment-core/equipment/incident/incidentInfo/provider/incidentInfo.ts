import { Provider } from '@nestjs/common';
import { IIncidentInfoRepository } from '@equipment/incident/incidentInfo/interface/incidentInfo';
import { IncidentInfoRepository } from '@equipment/incident/incidentInfo/repository/incidentInfo';

export const IncidentInfoRepositoryProvider: Provider = {
  provide: IIncidentInfoRepository,
  useClass: IncidentInfoRepository,
};
