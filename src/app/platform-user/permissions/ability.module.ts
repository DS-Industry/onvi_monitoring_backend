import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserRoleModule } from '@platform-user/user-role/user-role.module';
import { ObjectModule } from '@object-permission/object.module';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { UserModule } from '@platform-user/user/user.module';

@Module({
  imports: [PrismaModule, UserRoleModule, ObjectModule, UserModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
