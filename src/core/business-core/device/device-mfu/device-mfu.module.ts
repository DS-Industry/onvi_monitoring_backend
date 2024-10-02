import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceMfuRepositoryProvider } from '@device/device-mfu/provider/device-mfu';
import { CreateDeviceMfuUseCase } from '@device/device-mfu/use-case/device-mfu-create';
import { DeviceMfuHandlerUseCase } from '@device/device-mfu/use-case/device-mfu-handler';
import { PosModule } from "@pos/pos.module";

@Module({
  imports: [PrismaModule, PosModule],
  providers: [
    DeviceMfuRepositoryProvider,
    CreateDeviceMfuUseCase,
    DeviceMfuHandlerUseCase,
  ],
  exports: [DeviceMfuHandlerUseCase],
})
export class DeviceMfuModule {}
