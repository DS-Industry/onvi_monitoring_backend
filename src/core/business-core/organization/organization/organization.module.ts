import { Module } from '@nestjs/common';
import { OrganizationRepositoryProvider } from './provider/organization';
import { CreateOrganizationUseCase } from './use-cases/organization-create';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AddressModule } from '@address/address.module';
import { GetByIdOrganizationUseCase } from './use-cases/organization-get-by-id';
import { DocumentsModule } from '../documents/documents.module';
import { AddDocumentUseCase } from './use-cases/organization-add-documents';
import { UpdateOrganizationUseCase } from './use-cases/organization-update';
import { GetAllUsersOrganizationUseCase } from './use-cases/organization-get-all-users';
import { AddWorkerOrganizationUseCase } from './use-cases/organization-add-worker';
import { OrganizationConfirmMailModule } from '../confirmMail/confirmMail.module';
import { GetAllOrganizationByOwnerUseCase } from '@organization/organization/use-cases/organization-get-all-by-owner';
import { GetAllPosOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-pos';
import { PosModule } from '@pos/pos/pos.module';

@Module({
  imports: [
    PrismaModule,
    AddressModule,
    DocumentsModule,
    OrganizationConfirmMailModule,
    PosModule,
  ],
  providers: [
    OrganizationRepositoryProvider,
    CreateOrganizationUseCase,
    GetByIdOrganizationUseCase,
    AddDocumentUseCase,
    UpdateOrganizationUseCase,
    GetAllUsersOrganizationUseCase,
    AddWorkerOrganizationUseCase,
    GetAllOrganizationByOwnerUseCase,
    GetAllPosOrganizationUseCase,
  ],
  exports: [
    CreateOrganizationUseCase,
    GetByIdOrganizationUseCase,
    AddDocumentUseCase,
    UpdateOrganizationUseCase,
    GetAllUsersOrganizationUseCase,
    AddWorkerOrganizationUseCase,
    GetAllOrganizationByOwnerUseCase,
    GetAllPosOrganizationUseCase,
  ],
})
export class OrganizationModule {}
