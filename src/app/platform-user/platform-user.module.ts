import { Module } from '@nestjs/common';
import { UserModule } from '@platform-user/user/user.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserAuthModule } from '@platform-user/auth/user-auth.module';

@Module({
  imports: [UserModule, PrismaModule, UserAuthModule],
  exports: [UserModule, UserAuthModule],
})
export class PlatformUserModule {}
