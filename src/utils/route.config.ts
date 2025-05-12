import { Routes } from '@nestjs/core';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';
import { AdminRoleModule } from '@platform-admin/admin-role/admin-role.module';
import { AdminPermissionsModule } from '@platform-admin/admin-permissions/admin-permissions.module';
import { DeviceAuthModule } from '@platform-device/auth/device-auth.module';
import { PlatformUserModule } from '@platform-user/platform-user.module';

export const routeConfig: Routes = [
  {
    path: 'admin',
    children: [AdminAuthModule, AdminRoleModule, AdminPermissionsModule],
  },
  {
    path: 'user',
    children: [PlatformUserModule],
  },
  {
    path: 'client',
    children: [ClientAuthModule],
  },
  {
    path: 'deviceApp',
    children: [DeviceAuthModule],
  },
];
