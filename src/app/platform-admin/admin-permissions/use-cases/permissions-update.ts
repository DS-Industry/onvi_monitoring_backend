import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { UpdatePermissionsDto } from '@platform-admin/admin-permissions/use-cases/dto/permissions-update.dto';

@Injectable()
export class UpdatePermissionsUseCase {
  constructor(private permissionsRepository: IPermissionsRepository) {}

  async execute(input: UpdatePermissionsDto) {
    const permissions = await this.permissionsRepository.findOneById(input.id);
    if (!permissions) {
      throw new Error('permissions not exists');
    }
    const { action, objectId, condition } = input;

    permissions.action = action ? action : permissions.action;
    permissions.objectId = objectId ? objectId : permissions.objectId;
    permissions.condition = condition ? condition : permissions.condition;

    return await this.permissionsRepository.update(permissions.id, permissions);
  }
}
