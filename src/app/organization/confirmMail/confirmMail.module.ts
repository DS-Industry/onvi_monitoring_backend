import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';
import { OrganizationConfirmMailProvider } from '@organization/confirmMail/provider/confirmMail';
import { SendOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-send';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';

@Module({
  imports: [PrismaModule, DateModule, MailModule],
  providers: [
    OrganizationConfirmMailProvider,
    SendOrganizationConfirmMailUseCase,
    ValidateOrganizationConfirmMailUseCase,
  ],
  exports: [
    SendOrganizationConfirmMailUseCase,
    ValidateOrganizationConfirmMailUseCase,
  ],
})
export class OrganizationConfirmMailModule {}
