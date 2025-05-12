import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { UpdatePermissionsDto } from '@platform-admin/admin-permissions/controller/dto/permissions-update.dto';

@Injectable()
export class UpdatePermissionsUseCase {
  constructor(private permissionsRepository: IPermissionsRepository) {}

  async execute(input: UpdatePermissionsDto) {
    const permissions = await this.permissionsRepository.findOneById(input.id);
    if (!permissions) {
      throw new Error('permissions not exists');
    }
    const { action, objectId } = input;

    permissions.action = action ? action : permissions.action;
    permissions.objectId = objectId ? objectId : permissions.objectId;

    return await this.permissionsRepository.update(permissions.id, permissions);
  }
}
