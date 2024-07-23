import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AbilityFactory } from '@platform-admin/permissions/ability.factory';
import { UserRoleModule } from '@platform-user/user-role/user-role.module';
import { ObjectModule } from '@platform-user/object/object.module';

@Module({
  imports: [PrismaModule, UserRoleModule, ObjectModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
