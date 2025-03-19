import { Module, Provider } from '@nestjs/common';
import { OrganizationRepositoryProvider } from './organization/provider/organization';
import { CreateOrganizationUseCase } from './organization/use-cases/organization-create';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AddDocumentUseCase } from './organization/use-cases/organization-add-documents';
import { UpdateOrganizationUseCase } from './organization/use-cases/organization-update';
import { PosModule } from '@pos/pos.module';
import { GetRatingOrganizationUseCase } from '@organization/organization/use-cases/organization-get-rating';
import { GetStatisticsOrganizationUseCase } from '@organization/organization/use-cases/organization-get-statistics';
import { FilterByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-filter-by-user';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { OrganizationConfirmMailProvider } from '@organization/confirmMail/provider/confirmMail';
import { DocumentsRepositoryProvider } from '@organization/documents/provider/documents';
import { SendOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-send';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';
import { FileModule } from '@libs/file/module';
import { FindMethodsDocumentUseCase } from '@organization/documents/use-cases/document-find-methods';
import { UpdateConfirmMailUseCase } from "@organization/confirmMail/use-case/confirm-mail-update";

const repositories: Provider[] = [
  OrganizationRepositoryProvider,
  OrganizationConfirmMailProvider,
  DocumentsRepositoryProvider,
];

const organizationUseCase: Provider[] = [
  FindMethodsOrganizationUseCase,
  CreateOrganizationUseCase,
  AddDocumentUseCase,
  UpdateOrganizationUseCase,
  GetRatingOrganizationUseCase,
  GetStatisticsOrganizationUseCase,
  FilterByUserOrganizationUseCase,
];

const confirmMailOrganizationUseCase: Provider[] = [
  SendOrganizationConfirmMailUseCase,
  ValidateOrganizationConfirmMailUseCase,
  UpdateConfirmMailUseCase,
];

const documentOrganizationUseCase: Provider[] = [
  FindMethodsDocumentUseCase,
];

@Module({
  imports: [
    PrismaModule,
    PosModule,
    DateModule,
    MailModule,
    FileModule,
  ],
  providers: [
    ...repositories,
    ...organizationUseCase,
    ...confirmMailOrganizationUseCase,
    ...documentOrganizationUseCase,
  ],
  exports: [
    ...organizationUseCase,
    ...confirmMailOrganizationUseCase,
    ...documentOrganizationUseCase,
  ],
})
export class OrganizationModule {}
