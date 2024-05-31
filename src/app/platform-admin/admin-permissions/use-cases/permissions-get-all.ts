import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

@Injectable()
export class GetAllPermissionsUseCases {
  constructor(private permissionsRepository: IPermissionsRepository) {}

  async execute(): Promise<AdminPermission[]> {
    return await this.permissionsRepository.findAll();
  }
}
