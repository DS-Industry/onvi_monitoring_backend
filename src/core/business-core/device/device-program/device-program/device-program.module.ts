import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceProgramRepositoryProvider } from '@device/device-program/device-program/provider/device-program';
import { DeviceProgramHandlerUseCase } from '@device/device-program/device-program/use-case/device-program-handler';
import { CreateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-create';
import { DeviceProgramTypeModule } from '@device/device-program/device-program-type/device-program-type.module';
import { GetAllByPosIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-pos-id-and-date';
import { GetAllByDeviceIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-device-id-and-date';
import { DataByPosIdDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-data-by-pos-id';
import { GetByIdDeviceProgramTypeUseCase } from '@device/device-program/device-program-type/use-case/device-program-type-get-by-id';
import { DeviceProgramGetLastProgByPosIdUseCase } from '@device/device-program/device-program/use-case/device-program-get-last-prog-by-pos-id';
import { DeviceProgramGetLastProgByDeviceIdUseCase } from '@device/device-program/device-program/use-case/device-program-get-last-prog-by-device-id';
import { CheckCarDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-check-car';
import { GetAllByOrgIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-org-id-and-date';
import { PosModule } from "@pos/pos.module";

@Module({
  imports: [PrismaModule, PosModule, DeviceProgramTypeModule],
  providers: [
    DeviceProgramRepositoryProvider,
    DeviceProgramHandlerUseCase,
    CreateDeviceProgramUseCase,
    GetAllByPosIdAndDateDeviceProgramUseCase,
    GetAllByDeviceIdAndDateDeviceProgramUseCase,
    DataByPosIdDeviceProgramUseCase,
    GetByIdDeviceProgramTypeUseCase,
    DeviceProgramGetLastProgByPosIdUseCase,
    DeviceProgramGetLastProgByDeviceIdUseCase,
    CheckCarDeviceProgramUseCase,
    GetAllByOrgIdAndDateDeviceProgramUseCase,
  ],
  exports: [
    DeviceProgramTypeModule,
    DeviceProgramHandlerUseCase,
    GetAllByPosIdAndDateDeviceProgramUseCase,
    GetAllByDeviceIdAndDateDeviceProgramUseCase,
    DataByPosIdDeviceProgramUseCase,
    GetByIdDeviceProgramTypeUseCase,
    DeviceProgramGetLastProgByPosIdUseCase,
    DeviceProgramGetLastProgByDeviceIdUseCase,
    CheckCarDeviceProgramUseCase,
    GetAllByOrgIdAndDateDeviceProgramUseCase,
  ],
})
export class DeviceProgramModule {}
