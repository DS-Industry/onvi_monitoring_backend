import { Provider } from '@nestjs/common';
import { IEquipmentKnotRepository } from '@equipment/equipmentKnot/interface/equipmentKnot';
import { EquipmentKnotRepository } from '@equipment/equipmentKnot/repository/equipmentKnot';

export const EquipmentKnotRepositoryProvider: Provider = {
  provide: IEquipmentKnotRepository,
  useClass: EquipmentKnotRepository,
};
