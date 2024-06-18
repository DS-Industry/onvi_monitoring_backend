import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { JSONObject } from '@common/types/json-type';
import { GetByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-by-id';
import { GetPermissionsByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-permissions-by-id';
import { GetByIdObjectUseCase } from '@platform-admin/object/use-case/object-get-by-id';
import { createPrismaAbility } from '@casl/prisma';

export enum PermissionAction {
  Manage = 'manage',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Read = 'read',
}

interface CaslPermission {
  action: PermissionAction;
  subject: string;
  condition?: JSONObject;
}
export type PermissionObjectType = any;
//Используем этот тип по новой доке
export type AppAbility = PureAbility<[PermissionAction, PermissionObjectType]>;

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

    //Билдер с createPrismaAbility необходим, чтобы использовать condition
    //У того индуса в видосе есть закрепелнный коммент на эту тему
    const abilityBuilder = new AbilityBuilder(createPrismaAbility);

    for (const p of dbPermissions) {
      const conditions = AdminPermission.parseCondition(p.condition, admin);
      console.log(p.condition);
      console.log(conditions);
      abilityBuilder.can(
        p.action,
        p.permissionObject.name,
        p.condition,
        //AdminPermission.parseCondition(p.condition, admin),
      );
    }

    return abilityBuilder.build();
    //Второй вариант
    /*const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: PermissionAction.Manage,                                       //Требует данный тип
      subject: p.permissionObject.name,
      conditions: AdminPermission.parseCondition(p.condition, admin),
    }));
    const test = [{ action: PermissionAction.Create, subject: Admin }];
    console.log(caslPermissions);
    return new PureAbility<[PermissionAction, PermissionObjectType]>(
      caslPermissions,
    );*/
  }
}
