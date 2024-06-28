import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';
import { ConfirmMailProvider } from '@platform-user/confirmMail/provider/confirmMail';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { ValidateConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-validate';

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
export class ConfirmMailUserModule {}
