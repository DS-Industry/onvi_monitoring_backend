import { Module } from '@nestjs/common';
import { AdminModule } from '@platform-admin/admin/admin.module';
import { PrismaModule } from '@db/prisma/prisma.module';

@Module({
  imports: [AdminModule, PrismaModule],
  controllers: [],
  providers: [],
  exports: [AdminModule],
})
export class PlatformAdminModule {}
