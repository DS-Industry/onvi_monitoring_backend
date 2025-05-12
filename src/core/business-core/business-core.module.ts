import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organization/organization.module';
import { PosModule } from '@pos/pos.module';
import { AddressModule } from '@address/address.module';

@Module({
  imports: [OrganizationModule, PosModule, AddressModule],
  exports: [OrganizationModule, PosModule, AddressModule],
})
export class BusinessCoreModule {}
