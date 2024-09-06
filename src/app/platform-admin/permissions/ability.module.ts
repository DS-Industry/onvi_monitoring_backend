import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { AbilityFactory } from '@platform-admin/permissions/ability.factory';
import { AdminRoleModule } from '@platform-admin/admin-role/admin-role.module';
import { ObjectModule } from '@platform-admin/object/object.module';

@Module({
  imports: [PrismaModule, AdminRoleModule, ObjectModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
