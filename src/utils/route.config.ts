import { Routes } from '@nestjs/core';
import { PlatformAdminModule } from '@platform-admin/platform-admin.module';
import { PlatformUserModule } from '@platform-user/platform-user.module';
import { MobileUserModule } from '@mobile-user/mobile-user.module';

export const routeConfig: Routes = [
  {
    path: 'admin',
    module: PlatformAdminModule,
  },
  {
    path: 'user',
    module: PlatformUserModule,
  },
  {
    path: 'client',
    module: MobileUserModule,
  },
];
