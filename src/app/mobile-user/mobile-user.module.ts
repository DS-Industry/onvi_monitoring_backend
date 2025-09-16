import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientModule } from '@mobile-user/client/client.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';
import { CardModule } from '@mobile-user/card/card.module';

@Module({
  imports: [ClientModule, PrismaModule, ClientAuthModule, CardModule],
  exports: [ClientModule, ClientAuthModule, CardModule],
})
export class MobileUserModule {}
