import { UserRole } from '@platform-user/permissions/user-role/domain/user-role';
import { UserPermission } from '@platform-user/permissions/user-permissions/domain/user-permissions';

export abstract class IRoleRepository {
  abstract create(input: UserRole): Promise<UserRole>;
  abstract update(id: number, input: UserRole): Promise<UserRole>;
  abstract remove(id: number): Promise<UserRole>;
  abstract findAll(): Promise<UserRole[]>;
  abstract findOneById(id: number): Promise<UserRole>;
  abstract findOneByName(name: string): Promise<UserRole>;
  abstract findAllPermissionsById(id: number): Promise<UserPermission[]>;
  abstract findAllByUserId(userId: number): Promise<UserRole[]>;
}
