import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { AbilityBuilder } from '@casl/ability';
import { GetPermissionsByIdRoleUseCase } from '@platform-user/user-role/use-cases/role-get-permission-by-id';
import { GetByIdObjectUseCase } from '@object-permission/use-case/object-get-by-id';
import { createPrismaAbility } from '@casl/prisma';
import { GetIdPosPermissionUserUseCase } from '@platform-user/user/use-cases/user-get-id-pos-permission';
import { GetIdOrganizationPermissionUserUseCase } from '@platform-user/user/use-cases/user-get-id-organization-permission';

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly roleGetPermissionsById: GetPermissionsByIdRoleUseCase,
    private readonly objectGetById: GetByIdObjectUseCase,
    private readonly getIdPosPermissionUserUseCase: GetIdPosPermissionUserUseCase,
    private readonly getIdOrganizationPermissionUserUseCase: GetIdOrganizationPermissionUserUseCase,
  ) {}

  async createForPlatformManager(user: User): Promise<any> {
    const permissions = await this.roleGetPermissionsById.execute(
      user.userRoleId,
    );

    const organizationCondition =
      await this.getIdOrganizationPermissionUserUseCase.execute(user.id);
    const posCondition = await this.getIdPosPermissionUserUseCase.execute(
      user.id,
    );

    const objectMap = {};
    for (const permission of permissions) {
      if (!objectMap[permission.objectId]) {
        objectMap[permission.objectId] = await this.objectGetById.execute(
          permission.objectId,
        );
      }
    }
    const dbPermissions = permissions.map((permission) => {
      let condition = {};
      if (objectMap[permission.objectId].name == 'Pos') {
        condition = {
          id: { in: posCondition },
          organizationId: { in: organizationCondition },
        };
      }
      console.log(condition);
      return {
        id: permission.id,
        action: permission.action,
        condition: condition,
        permissionObject: objectMap[permission.objectId],
      };
    });

    const abilityBuilder = new AbilityBuilder(createPrismaAbility);
    for (const p of dbPermissions) {
      abilityBuilder.can(p.action, p.permissionObject.name, p?.condition);
    }
    return abilityBuilder.build();
  }
}
