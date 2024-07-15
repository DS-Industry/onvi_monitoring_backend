import { UserPermission } from '@platform-user/user-permissions/domain/user-permissions';

export abstract class IPermissionsRepository {
  abstract create(
    input: UserPermission,
    roles: { id: number }[],
  ): Promise<UserPermission>;
  abstract update(id: number, input: UserPermission): Promise<UserPermission>;
  abstract remove(id: number): Promise<UserPermission>;
  abstract findAll(): Promise<UserPermission[]>;
  abstract findOneById(id: number): Promise<UserPermission>;
}
