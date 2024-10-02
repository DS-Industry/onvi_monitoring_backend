import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PosRepositoryProvider } from '@pos/pos/provider/pos';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { AddressModule } from '@address/address.module';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { MonitoringPosUseCase } from '@pos/pos/use-cases/pos-monitoring';
import { FilterByUserPosUseCase } from '@pos/pos/use-cases/pos-filter-by-user';
import { MonitoringFullByIdPosUseCase } from '@pos/pos/use-cases/pos-monitoring-full-by-id';
import { ProgramPosUseCase } from '@pos/pos/use-cases/pos-program';
import { PosProgramFullUseCase } from '@pos/pos/use-cases/pos-program-full';
import { DeviceOperationModule } from '@device/device-operation/device-operation.module';
import { UserModule } from '@platform-user/user/user.module';
import { DeviceProgramModule } from '@device/device-program/device-program/device-program.module';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { CarWashPosProvider } from '@pos/carWashPos/provider/carWashPos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashDeviceTypeRepositoryProvider } from '@pos/device/deviceType/provider/deviceType';
import { CreateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-create';
import { UpdateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-update';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { CarWashDeviceRepositoryProvider } from '@pos/device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-create';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';

const repositories: Provider[] = [
  PosRepositoryProvider,
  CarWashPosProvider,
  CarWashDeviceRepositoryProvider,
  CarWashDeviceTypeRepositoryProvider,
];

const posUseCase: Provider[] = [
  CreatePosUseCase,
  CreateFullDataPosUseCase,
  MonitoringPosUseCase,
  FilterByUserPosUseCase,
  MonitoringFullByIdPosUseCase,
  ProgramPosUseCase,
  PosProgramFullUseCase,
  FindMethodsPosUseCase,
];

const carWashPosUseCase: Provider[] = [FindMethodsCarWashPosUseCase];

const deviceUseCase: Provider[] = [
  CreateCarWashDeviceUseCase,
  FindMethodsCarWashDeviceUseCase,
];

const deviceTypeUseCase: Provider[] = [
  CreateCarWashDeviceTypeUseCase,
  UpdateCarWashDeviceTypeUseCase,
  FindMethodsCarWashDeviceTypeUseCase,
];
@Module({
  imports: [
    PrismaModule,
    AddressModule,
    DeviceProgramModule,
    DeviceOperationModule,
    UserModule,
  ],
  providers: [
    ...repositories,
    ...carWashPosUseCase,
    ...posUseCase,
    ...deviceUseCase,
    ...deviceTypeUseCase,
  ],
  exports: [...carWashPosUseCase, ...posUseCase, ...deviceUseCase],
})
export class PosModule {}
