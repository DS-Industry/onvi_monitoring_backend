import { AdminRole } from '@platform-admin/admin-role/domain/admin-role';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

export abstract class IRoleRepository {
  abstract create(input: AdminRole): Promise<AdminRole>;
  abstract update(id: number, input: AdminRole): Promise<AdminRole>;
  abstract remove(id: number): Promise<AdminRole>;
  abstract findAll(): Promise<AdminRole[]>;
  abstract findOneById(id: number): Promise<AdminRole>;
  abstract findOneByName(name: string): Promise<AdminRole>;
  abstract findAllPermissionsById(id: number): Promise<AdminPermission[]>;
}
