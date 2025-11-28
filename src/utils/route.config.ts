import { Routes } from '@nestjs/core';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';
import { AdminRoleModule } from '@platform-admin/admin-role/admin-role.module';
import { AdminPermissionsModule } from '@platform-admin/admin-permissions/admin-permissions.module';
import { DeviceAuthModule } from '@platform-device/auth/device-auth.module';
import { PlatformUserModule } from '@platform-user/platform-user.module';
import { DeviceModule } from '@platform-device/device/device.module';
import { MobileOrderModule } from '@mobile-user/order/order.module';
import { CardModule } from '@mobile-user/card/card.module';
import { ClientModule } from '@mobile-user/client/client.module';

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
    children: [ClientAuthModule, MobileOrderModule, CardModule, ClientModule],
  },
  {
    path: 'device',
    children: [DeviceAuthModule, DeviceModule],
  },
];
