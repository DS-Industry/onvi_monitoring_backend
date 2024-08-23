import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceAbilityFactory } from '../permissions/ability.factory';
import { DeviceRoleModule } from '../device-role/device-role-module';
import { CarWashDeviceModule } from '../car-wash-device/car-wash-device.module';

@Module({
  imports: [PrismaModule, DeviceRoleModule, CarWashDeviceModule],
  providers: [CarWashDeviceAbilityFactory],
  exports: [CarWashDeviceAbilityFactory],
})
export class CarWashDeviceAbilityModule {}
