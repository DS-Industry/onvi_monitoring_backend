import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organization/organization.module';
import { PosModule } from '@pos/pos.module';
import { DeviceDataRawModule } from '@device/device-data-raw/device-data-raw.module';
import { AddressModule } from '@address/address.module';

@Module({
  imports: [
    OrganizationModule,
    PosModule,
    DeviceDataRawModule,
    AddressModule,
  ],
  exports: [
    OrganizationModule,
    PosModule,
    DeviceDataRawModule,
    AddressModule,
  ],
})
export class BusinessCoreModule {}
