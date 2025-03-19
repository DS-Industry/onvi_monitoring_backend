import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientController } from '@mobile-user/client/controller/client';
import { FileModule } from '@libs/file/module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';

@Module({
  imports: [PrismaModule, FileModule, LoyaltyCoreModule],
  controllers: [ClientController],
  exports: [LoyaltyCoreModule],
})
export class ClientModule {}
