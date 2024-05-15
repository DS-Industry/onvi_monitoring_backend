import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ConfirmMailProvider } from '@platform-admin/confirmMail/provider/confirmMail';
import { SendConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-send';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';

@Module({
  imports: [PrismaModule, DateModule, MailModule],
  providers: [ConfirmMailProvider, SendConfirmMailUseCase],
  exports: [ConfirmMailProvider, SendConfirmMailUseCase],
})
export class ConfirmMailModule {}
