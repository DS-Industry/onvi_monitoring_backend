import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organization/organization/organization.module';
import { PosModule } from '@pos/pos/pos.module';
import { DeviceModule } from '@device/device/device.module';
import { DeviceDataRawModule } from '@device/device-data-raw/device-data-raw.module';
import { AddressModule } from '@address/address.module';

@Module({
  imports: [
    OrganizationModule,
    PosModule,
    DeviceModule,
    DeviceDataRawModule,
    AddressModule,
  ],
  exports: [
    OrganizationModule,
    PosModule,
    DeviceModule,
    DeviceDataRawModule,
    AddressModule,
  ],
})
export class BusinessCoreModule {}
