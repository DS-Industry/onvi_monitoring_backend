import { Injectable } from '@nestjs/common';
import { UserPermission } from '@platform-user/permissions/user-permissions/domain/user-permissions';
import { IPermissionsRepository } from '@platform-user/permissions/user-permissions/interfaces/permissions';
import { PermissionAction } from '@platform-user/permissions/user-permissions/domain/permissionAction';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateUserPermissionUseCase {
  constructor(
    private readonly permissionsRepository: IPermissionsRepository,
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
  ) {}

  async execute(
    action: PermissionAction,
    objectId: number,
    user: User,
  ): Promise<UserPermission> {
    // Get user's roles
    const userRoles = await this.findMethodsRoleUseCase.getAllByUserId(user.id);
    
    if (userRoles.length === 0) {
      throw new Error('User has no roles assigned');
    }

    const permissionData = new UserPermission({
      action,
      objectId,
    });

    const rolesId = userRoles.map((role) => ({ id: role.id }));

    return await this.permissionsRepository.create(permissionData, rolesId);
  }
}
