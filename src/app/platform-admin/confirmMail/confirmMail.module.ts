import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ConfirmMailProvider } from '@platform-admin/confirmMail/provider/confirmMail';
import { SendConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-send';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';
import { ValidateConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-validate';

@Module({
  imports: [PrismaModule, DateModule, MailModule],
  providers: [
    ConfirmMailProvider,
    SendConfirmMailUseCase,
    ValidateConfirmMailUseCase,
  ],
  exports: [
    ConfirmMailProvider,
    SendConfirmMailUseCase,
    ValidateConfirmMailUseCase,
  ],
})
export class ConfirmMailAdminModule {}
