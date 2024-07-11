import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/user-role/interfaces/role';
import { UserPermission } from '@platform-user/user-permissions/domain/user-permission';

@Injectable()
export class GetPermissionsByIdRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(input: number): Promise<UserPermission[]> {
    const permissions = await this.roleRepository.findAllPermissionsById(input);
    if (!permissions) {
      throw new Error('permissions not exists');
    }
    return permissions;
  }
}
