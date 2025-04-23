import { Provider } from '@nestjs/common';
import { IIncidentNameRepository } from '@equipment/incident/incidentName/interface/incidentName';
import { IncidentNameRepository } from '@equipment/incident/incidentName/repository/incidentName';

export const IncidentNameRepositoryProvider: Provider = {
  provide: IIncidentNameRepository,
  useClass: IncidentNameRepository,
};
