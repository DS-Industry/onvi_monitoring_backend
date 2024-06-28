import { Module } from '@nestjs/common';
import { OrganizationController } from '@organization/organization/controller/organization';
import { OrganizationRepositoryProvider } from '@organization/organization/provider/organization';
import { CreateOrganizationUseCase } from '@organization/organization/use-cases/organization-create';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AddressModule } from '@address/address.module';
import { PlatformUserModule } from '@platform-user/platform-user.module';
import { GetByIdOrganizationUseCase } from '@organization/organization/use-cases/organization-get-by-id';
import { DocumentsModule } from '@organization/documents/documents.module';
import { AddDocumentUseCase } from '@organization/organization/use-cases/organization-add-documents';
import { UpdateOrganizationUseCase } from '@organization/organization/use-cases/organization-update';
import { GetAllUsersOrganization } from '@organization/organization/use-cases/organization-get-all-users';
import { AddWorkerOrganizationUseCase } from '@organization/organization/use-cases/organization-add-worker';
import { OrganizationConfirmMailModule } from '@organization/confirmMail/confirmMail.module';

@Module({
  imports: [
    PrismaModule,
    PlatformUserModule,
    AddressModule,
    DocumentsModule,
    OrganizationConfirmMailModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationRepositoryProvider,
    CreateOrganizationUseCase,
    GetByIdOrganizationUseCase,
    AddDocumentUseCase,
    UpdateOrganizationUseCase,
    GetAllUsersOrganization,
    AddWorkerOrganizationUseCase,
  ],
  exports: [],
})
export class OrganizationModule {}
