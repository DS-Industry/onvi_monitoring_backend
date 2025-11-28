import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientModule } from '@mobile-user/client/client.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';
import { CardModule } from '@mobile-user/card/card.module';
import { MobileOrderModule } from '@mobile-user/order/order.module';

@Module({
  imports: [
    ClientModule,
    PrismaModule,
    ClientAuthModule,
    CardModule,
    MobileOrderModule,
  ],
  exports: [ClientModule, ClientAuthModule, CardModule, MobileOrderModule],
})
export class MobileUserModule {}
