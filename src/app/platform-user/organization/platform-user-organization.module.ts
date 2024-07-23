import { Module } from '@nestjs/common';
import { OrganizationController } from '@platform-user/organization/controller/organization';
import { PreAddWorkerOrganizationUseCase } from '@platform-user/organization/use-cases/organization-pre-add-worker';
import { UserModule } from '@platform-user/user/user.module';
import { BusinessCoreModule } from '@business-core/business-core.module';

@Module({
  imports: [UserModule, BusinessCoreModule],
  controllers: [OrganizationController],
  providers: [PreAddWorkerOrganizationUseCase],
})
export class PlatformUserOrganizationModule {}
