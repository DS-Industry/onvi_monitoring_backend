import { Module } from '@nestjs/common';
import { AdminModule } from '@platform-admin/admin/admin.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';
import { AdminPermissionsModule } from '@platform-admin/admin-permissions/admin-permissions.module';
import { AdminRoleModule } from '@platform-admin/admin-role/admin-role.module';
import { ObjectModule } from "@platform-admin/object/object.module";
import { AbilityModule } from "@platform-admin/permissions/ability.module";

@Module({
  imports: [
    AdminModule,
    PrismaModule,
    AdminAuthModule,
    AdminPermissionsModule,
    AdminRoleModule,
    ObjectModule,
  ],
  exports: [AdminModule, AdminAuthModule],
})
export class PlatformAdminModule {}
