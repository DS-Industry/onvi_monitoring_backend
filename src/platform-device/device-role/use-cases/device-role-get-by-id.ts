import { Injectable } from '@nestjs/common';
import { IDeviceRoleRepository } from '../interfaces/role';

@Injectable()
export class GetDeviceRoleByIdUseCase {
  constructor(private readonly deviceRoleRepository: IDeviceRoleRepository) {}

  async execute(id: number): Promise<any> {
    return await this.deviceRoleRepository.findOneById(id);
  }
}
