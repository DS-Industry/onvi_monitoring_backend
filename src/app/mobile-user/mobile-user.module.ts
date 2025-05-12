import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientModule } from '@mobile-user/client/client.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';

@Module({
  imports: [ClientModule, PrismaModule, ClientAuthModule, ],
  exports: [ClientModule, ClientAuthModule],
})
export class MobileUserModule {}
