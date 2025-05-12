import { IncidentInfo } from '@equipment/incident/incidentInfo/domain/incidentInfo';

export abstract class IIncidentInfoRepository {
  abstract create(input: IncidentInfo): Promise<IncidentInfo>;
  abstract findOneById(id: number): Promise<IncidentInfo>;
  abstract findAllByIncidentNameId(id: number): Promise<IncidentInfo[]>;
}
