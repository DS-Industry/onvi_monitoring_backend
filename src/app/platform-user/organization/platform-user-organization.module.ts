import { Module } from '@nestjs/common';
import { OrganizationController } from '@platform-user/organization/controller/organization';
import { UserModule } from '@platform-user/user/user.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { FilterByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-filter-by-user';
import { AbilityModule } from '@platform-user/permissions/ability.module';
import { OrganizationValidateRules } from '@platform-user/organization/controller/validate/organization-validate-rules';

@Module({
  imports: [UserModule, BusinessCoreModule, AbilityModule],
  controllers: [OrganizationController],
  providers: [OrganizationValidateRules],
})
export class PlatformUserOrganizationModule {}
