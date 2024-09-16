import { Module } from '@nestjs/common';
import { ILoggerAdapter } from './adapter';
import { LoggerService } from './service';

@Module({
  providers: [
    {
      provide: ILoggerAdapter,
      useClass: LoggerService,
    },
  ],
  exports: [ILoggerAdapter],
})
export class LoggerModule {}
