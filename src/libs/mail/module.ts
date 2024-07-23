import { Module } from '@nestjs/common';
import { IMailAdapter } from '@libs/mail/adapter';
import { MailService } from '@libs/mail/service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: IMailAdapter,
      useClass: MailService,
    },
  ],
  exports: [IMailAdapter],
})
export class MailModule {}
