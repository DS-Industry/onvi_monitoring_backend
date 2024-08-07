import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { AbilityBuilder } from '@casl/ability';
import { GetByIdRoleUseCase } from '@platform-user/user-role/use-cases/role-get-by-id';
import { GetPermissionsByIdRoleUseCase } from '@platform-user/user-role/use-cases/role-get-permission-by-id';
import { GetByIdObjectUseCase } from '@platform-user/object/use-case/object-get-by-id';
import { createPrismaAbility } from '@casl/prisma';

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly roleGetById: GetByIdRoleUseCase,
    private readonly roleGetPermissionsById: GetPermissionsByIdRoleUseCase,
    private readonly objectGetById: GetByIdObjectUseCase,
  ) {}

  async createForPlatformManager(user: User): Promise<any> {
    const role = await this.roleGetById.execute(user.userRoleId);
    const permissions = await this.roleGetPermissionsById.execute(role.id);

    const objectMap = {};
    for (const permission of permissions) {
      if (!objectMap[permission.objectId]) {
        objectMap[permission.objectId] = await this.objectGetById.execute(
          permission.objectId,
        );
      }
    }
    const dbPermissions = permissions.map((permission) => ({
      id: permission.id,
      action: permission.action,
      condition: permission.condition,
      permissionObject: objectMap[permission.objectId],
    }));

    const abilityBuilder = new AbilityBuilder(createPrismaAbility);
    for (const p of dbPermissions) {
      abilityBuilder.can(p.action, p.permissionObject.name, p.condition);
    }
    return abilityBuilder.build();
  }
}
