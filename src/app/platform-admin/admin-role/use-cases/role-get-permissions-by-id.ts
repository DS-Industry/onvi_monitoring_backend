import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

@Injectable()
export class GetPermissionsByIdRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(input: number): Promise<AdminPermission[]> {
    const permissions = await this.roleRepository.findAllPermissionsById(input);
    if (!permissions) {
      throw new Error('permissions not exists');
    }
    return permissions;
  }
}
