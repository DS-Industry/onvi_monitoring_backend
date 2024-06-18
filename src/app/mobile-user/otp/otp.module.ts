import { Module } from '@nestjs/common';
import { OtpRepositoryProvider } from '@mobile-user/otp/provider/otp';
import { PrismaModule } from '@db/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [OtpRepositoryProvider],
  exports: [OtpRepositoryProvider],
})
export class OtpModule {}
