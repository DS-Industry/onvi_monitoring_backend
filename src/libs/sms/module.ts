import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ISmsAdapter } from '@libs/sms/adapter';
import { SmsService } from '@libs/sms/service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: ISmsAdapter,
      useClass: SmsService,
    },
  ],
  exports: [ISmsAdapter],
})
export class SmsModule {}
