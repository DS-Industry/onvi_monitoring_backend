import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserRoleModule } from '@platform-user/user-role/user-role.module';
import { ObjectModule } from '@platform-user/object/object.module';
import { AbilityFactory } from "@platform-user/permissions/ability.factory";

@Module({
  imports: [PrismaModule, UserRoleModule, ObjectModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
