import { IDateAdapter } from '@libs/date/adapter';
import { DateService } from '@libs/date/service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [
    {
      provide: IDateAdapter,
      useFactory: () => new DateService(),
    },
  ],
  exports: [IDateAdapter],
})
export class DateModule {}
