import { Injectable } from '@nestjs/common';
import { CreatePermissionsDto } from '@platform-admin/admin-permissions/controller/dto/permissions-create.dto';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';

@Injectable()
export class CreatePermissionsUseCase {
  constructor(private readonly permissionsRepository: IPermissionsRepository) {}

  async execute(input: CreatePermissionsDto): Promise<AdminPermission> {
    const permissionData = new AdminPermission({
      action: input.action,
      objectId: input.objectId,
    });

    const rolesId = input.roles.map((roleId) => ({ id: roleId }));

    return await this.permissionsRepository.create(permissionData, rolesId);
  }
}
