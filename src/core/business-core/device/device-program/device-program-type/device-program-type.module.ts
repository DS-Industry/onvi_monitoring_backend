import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceProgramTypeRepositoryProvider } from '@device/device-program/device-program-type/provider/device-program-type';
import { GetByIdDeviceProgramTypeUseCase } from '@device/device-program/device-program-type/use-case/device-program-type-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [
    DeviceProgramTypeRepositoryProvider,
    GetByIdDeviceProgramTypeUseCase,
  ],
  exports: [
    DeviceProgramTypeRepositoryProvider,
    GetByIdDeviceProgramTypeUseCase,
  ],
})
export class DeviceProgramTypeModule {}
