import { Injectable } from '@nestjs/common';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { User } from '@platform-user/user/domain/user';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import {
  PermissionsDto,
  PermissionsInfoResponseDto,
} from '@platform-user/permissions/use-cases/dto/permissions-info-response.dto';
import { GetByIdObjectUseCase } from '@object-permission/use-case/object-get-by-id';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';

@Injectable()
export class GetAllPermissionsInfoUseCases {
  constructor(
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly objectGetById: GetByIdObjectUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
  ) {}

  async getPermissionsInfoForUser(user: User) {
    const role = await this.findMethodsRoleUseCase.getById(user.userRoleId);
    const isSuperAdmin = role.name === 'Разработчик';

    const ability = await this.caslAbilityFactory.createForPlatformManager(
      user,
      isSuperAdmin,
    );
    const organizationCondition =
      await this.findMethodsUserUseCase.getOrgPermissionById(user.id);
    return {
      role: role.name,
      organizations: organizationCondition,
      permissions: ability.rules,
    };
  }

  async getAllPermissionsInfo(): Promise<PermissionsInfoResponseDto[]> {
    const response: PermissionsInfoResponseDto[] = [];
    const roles = await this.findMethodsRoleUseCase.getAll();
    await Promise.all(
      roles.map(async (role) => {
        const permissionsInfo: PermissionsDto[] = [];
        const permissions =
          await this.findMethodsRoleUseCase.getPermissionsById(role.id);
        for (const permission of permissions) {
          const object = await this.objectGetById.execute(permission.objectId);
          permissionsInfo.push({
            action: permission.action,
            subject: object.name,
          });
        }
        response.push({ role: role.name, permissions: permissionsInfo });
      }),
    );
    return response;
  }
}
