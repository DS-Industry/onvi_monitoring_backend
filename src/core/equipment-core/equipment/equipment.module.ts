import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { IncidentNameRepositoryProvider } from '@equipment/incident/incidentName/provider/incidentName';
import { EquipmentKnotRepositoryProvider } from '@equipment/equipmentKnot/provider/equipmentKnot';
import { IncidentInfoRepositoryProvider } from '@equipment/incident/incidentInfo/provider/incidentInfo';
import { IncidentRepositoryProvider } from '@equipment/incident/incident/provider/incident';
import { CreateIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-create';
import { FindMethodsEquipmentKnotUseCase } from '@equipment/equipmentKnot/use-cases/equipment-knot-find-methods';
import { FindMethodsIncidentNameUseCase } from '@equipment/incident/incidentName/use-cases/incident-name-find-methods';
import { FindMethodsIncidentInfoUseCase } from '@equipment/incident/incidentInfo/use-cases/incident-info-find-methods';
import { FullInfoByEquipmentKnotIncidentUseCase } from '@equipment/incident/incidentName/use-cases/incident-full-info-by-equipment-knot';
import { UpdateIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-update';
import { FindMethodsIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-find-methods';
import { GetAllByFilterIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-get-all-by-filter';

const repositories: Provider[] = [
  IncidentNameRepositoryProvider,
  IncidentInfoRepositoryProvider,
  IncidentRepositoryProvider,
  EquipmentKnotRepositoryProvider,
];

const incidentUseCase: Provider[] = [
  CreateIncidentUseCase,
  UpdateIncidentUseCase,
  FindMethodsIncidentUseCase,
  GetAllByFilterIncidentUseCase,
];
const incidentNameUseCase: Provider[] = [
  FindMethodsIncidentNameUseCase,
  FullInfoByEquipmentKnotIncidentUseCase,
];
const incidentInfoUseCase: Provider[] = [FindMethodsIncidentInfoUseCase];
const equipmentKnotUseCase: Provider[] = [FindMethodsEquipmentKnotUseCase];

@Module({
  imports: [PrismaModule],
  providers: [
    ...repositories,
    ...incidentUseCase,
    ...incidentNameUseCase,
    ...incidentInfoUseCase,
    ...equipmentKnotUseCase,
  ],
  exports: [
    ...incidentUseCase,
    ...incidentNameUseCase,
    ...incidentInfoUseCase,
    ...equipmentKnotUseCase,
  ],
})
export class EquipmentModule {}
