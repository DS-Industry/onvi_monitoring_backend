import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import {
  AdminPermission,
  PermissionCondition,
} from '@platform-admin/permissions/domain/admin-permission';

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
  condition?: PermissionCondition;
}
export type PermissionObjectType = any;
export type AppAbility = Ability<[PermissionAction, PermissionObjectType]>;

@Injectable()
export class AbilityFactory {
  constructor() {}

  async createForPlatformManager(admin: Admin): Promise<AppAbility> {
    //request to db
    const dbPermissions = [];
    const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: p.action,
      subject: p.permissionObject.name,
      conditions: AdminPermission.parseCondition(p.condition, admin),
    }));

    return new Ability<[PermissionAction, PermissionObjectType]>(
      caslPermissions,
    );
  }
}
