import { Routes } from '@nestjs/core';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';
import { UserAuthModule } from '@platform-user/auth/user-auth.module';
import { ClientAuthModule } from '@mobile-user/auth/client-auth.module';

export const routeConfig: Routes = [
  {
    path: 'admin',
    children: [AdminAuthModule],
  },
  {
    path: 'user',
    children: [UserAuthModule],
  },
  {
    path: 'client',
    children: [ClientAuthModule],
  },
];
