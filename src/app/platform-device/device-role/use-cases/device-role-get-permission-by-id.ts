import { Injectable } from '@nestjs/common';
import { IDeviceRoleRepository } from '../interfaces/role';

@Injectable()
export class GetPermissionsByRoleIdUseCase {
  constructor(private readonly deviceRoleRepository: IDeviceRoleRepository) {}

  async execute(roleId: number): Promise<any> {
    return await this.deviceRoleRepository.findAllPermissionsByRoleId(roleId);
  }
}
