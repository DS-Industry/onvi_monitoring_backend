import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceAbilityFactory } from '../permissions/ability.factory';
import { DeviceRoleModule } from '../device-role/device-role-module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { ObjectModule } from '@object-permission/object.module';

@Module({
  imports: [PrismaModule, DeviceRoleModule, ObjectModule, BusinessCoreModule],
  providers: [CarWashDeviceAbilityFactory],
  exports: [CarWashDeviceAbilityFactory],
})
export class CarWashDeviceAbilityModule {}
