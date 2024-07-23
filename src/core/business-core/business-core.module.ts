import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organization/organization/organization.module';
import { PosModule } from '@pos/pos/pos.module';
import { DeviceModule } from '@device/device/device.module';

@Module({
  imports: [OrganizationModule, PosModule, DeviceModule],
  exports: [OrganizationModule, PosModule, DeviceModule],
})
export class BusinessCoreModule {}
