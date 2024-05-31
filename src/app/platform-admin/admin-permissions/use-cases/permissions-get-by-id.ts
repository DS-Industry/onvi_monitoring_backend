import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';

@Injectable()
export class GetByIdPermissionsUseCase {
  constructor(private permissionsRepository: IPermissionsRepository) {}

  async execute(input: number) {
    const permissions = await this.permissionsRepository.findOneById(input);
    if (!permissions) {
      throw new Error('permissions not exists');
    }
    return permissions;
  }
}
