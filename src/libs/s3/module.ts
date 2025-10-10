import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS3Adapter } from './adapter';
import { S3Service } from './service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IS3Adapter,
      useClass: S3Service,
    },
  ],
  exports: [IS3Adapter],
})
export class S3Module {}
