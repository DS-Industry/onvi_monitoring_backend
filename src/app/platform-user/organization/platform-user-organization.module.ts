import { Module } from '@nestjs/common';
import { OrganizationController } from '@platform-user/organization/controller/organization';
import { PreAddWorkerOrganizationUseCase } from '@platform-user/organization/use-cases/organization-pre-add-worker';
import { UserModule } from '@platform-user/user/user.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { FilterByUserOrganizationUseCase } from '@platform-user/organization/use-cases/organization-filter-by-user';

@Module({
  imports: [UserModule, BusinessCoreModule],
  controllers: [OrganizationController],
  providers: [PreAddWorkerOrganizationUseCase, FilterByUserOrganizationUseCase],
})
export class PlatformUserOrganizationModule {}
