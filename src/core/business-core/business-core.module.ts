import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organization/organization/organization.module';
import { PosModule } from '@pos/pos/pos.module';

@Module({
  imports: [OrganizationModule, PosModule],
  exports: [OrganizationModule, PosModule],
})
export class BusinessCoreModule {}
