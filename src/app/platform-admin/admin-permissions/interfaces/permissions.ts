import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

export abstract class IPermissionsRepository {
  abstract create(
    input: AdminPermission,
    roles: { id: number }[],
  ): Promise<AdminPermission>;
  abstract update(id: number, input: AdminPermission): Promise<AdminPermission>;
  abstract remove(id: number): Promise<AdminPermission>;
  abstract findAll(): Promise<AdminPermission[]>;
  abstract findOneById(id: number): Promise<AdminPermission>;
}
