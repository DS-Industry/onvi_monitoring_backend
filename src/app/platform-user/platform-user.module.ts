import { Module } from '@nestjs/common';
import { UserModule } from '@platform-user/user/user.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserAuthModule } from '@platform-user/auth/user-auth.module';
import { UserPermissionsModule } from './user-permissions/user-permission.module';
import { UserRoleModule } from './user-role/user-role.module';

@Module({
  imports: [ 
    PrismaModule,
    UserModule,
    UserAuthModule,
    UserPermissionsModule,
    UserRoleModule,
 
  ],
  exports: [UserModule, UserAuthModule],
})
export class PlatformUserModule {}


