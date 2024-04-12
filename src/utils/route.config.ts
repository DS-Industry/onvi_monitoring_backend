import { Routes } from '@nestjs/core';
import { PlatformAdminModule } from '@platform-admin/platform-admin.module';

export const routeConfig: Routes = [
  {
    path: 'admin',
    module: PlatformAdminModule,
  },
];
