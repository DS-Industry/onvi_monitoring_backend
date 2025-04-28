import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';

export abstract class IIncidentNameRepository {
  abstract create(input: IncidentName): Promise<IncidentName>;
  abstract findOneById(id: number): Promise<IncidentName>;
  abstract findAllByEquipmentKnotId(id: number): Promise<IncidentName[]>;
  abstract update(input: IncidentName): Promise<IncidentName>;
}
