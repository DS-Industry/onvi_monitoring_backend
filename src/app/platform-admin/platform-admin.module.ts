import { Module } from '@nestjs/common';
import { AdminModule } from '@platform-admin/admin/admin.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';

@Module({
  imports: [AdminModule, PrismaModule, AdminAuthModule],
  controllers: [],
  providers: [],
  exports: [AdminModule, AdminAuthModule],
})
export class PlatformAdminModule {}
