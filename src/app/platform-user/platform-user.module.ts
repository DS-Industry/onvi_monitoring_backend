import { Module } from '@nestjs/common';
import { UserModule } from '@platform-user/user/user.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserAuthModule } from '@platform-user/auth/user-auth.module';
import { PlatformUserOrganizationModule } from '@platform-user/organization/platform-user-organization.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { PlatformUserPosModule } from '@platform-user/pos/platform-user-pos.module';
import { PlatformUserDeviceModule } from '@platform-user/device/platform-user-device.module';
import { UserPermissionsModule } from '@platform-user/user-permissions/user-permission.module';
import { UserRoleModule } from '@platform-user/user-role/user-role.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    UserAuthModule,
    UserPermissionsModule,
    UserRoleModule,
    PlatformUserDeviceModule,
    PlatformUserOrganizationModule,
    PlatformUserPosModule,
    BusinessCoreModule,
  ],
  exports: [UserModule, UserAuthModule],
})
export class PlatformUserModule {}
