import { EquipmentKnot } from '@equipment/equipmentKnot/domain/equipmentKnot';
import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';

export abstract class IEquipmentKnotRepository {
  abstract create(input: EquipmentKnot): Promise<EquipmentKnot>;
  abstract findOneById(id: number): Promise<EquipmentKnot>;
  abstract findAllByPosId(posId: number): Promise<EquipmentKnot[]>;
  abstract update(
    input: EquipmentKnot,
    incidentName?: IncidentName,
  ): Promise<EquipmentKnot>;
}
