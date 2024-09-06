import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceAbilityFactory } from '../permissions/ability.factory';
import { DeviceRoleModule } from '../device-role/device-role-module';
import { DeviceObjectModule } from '@platform-device/device-objects/device-objects.module';
import { BusinessCoreModule } from '@business-core/business-core.module';

@Module({
  imports: [
    PrismaModule,
    DeviceRoleModule,
    DeviceObjectModule,
    BusinessCoreModule,
  ],
  providers: [CarWashDeviceAbilityFactory],
  exports: [CarWashDeviceAbilityFactory],
})
export class CarWashDeviceAbilityModule {}
