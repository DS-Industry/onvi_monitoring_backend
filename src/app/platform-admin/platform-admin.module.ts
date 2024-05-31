import { Module } from '@nestjs/common';
import { AdminModule } from '@platform-admin/admin/admin.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';
import { AdminPermissionsModule } from '@platform-admin/admin-permissions/admin-permissions.module';
import { AdminRoleModule } from '@platform-admin/admin-role/admin-role.module';

@Module({
  imports: [
    AdminModule,
    PrismaModule,
    AdminAuthModule,
    AdminPermissionsModule,
    AdminRoleModule,
  ],
  exports: [AdminModule, AdminAuthModule],
})
export class PlatformAdminModule {}
