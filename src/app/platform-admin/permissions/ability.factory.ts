import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import { AbilityBuilder } from '@casl/ability';
import { GetByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-by-id';
import { GetPermissionsByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-permissions-by-id';
import { GetByIdObjectUseCase } from '@platform-admin/object/use-case/object-get-by-id';
import { createPrismaAbility } from '@casl/prisma';

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly roleGetById: GetByIdRoleUseCase,
    private readonly roleGetPermissionsById: GetPermissionsByIdRoleUseCase,
    private readonly objectGetById: GetByIdObjectUseCase,
  ) {}

  //Тест реализации находится в auth login
  async createForPlatformManager(admin: Admin): Promise<any> {
    //request to db
    const role = await this.roleGetById.execute(admin.platformUserRoleId);
    const permissions = await this.roleGetPermissionsById.execute(role.id);

    const objectMap = {};
    //Преобразуем id объекта в имя
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
