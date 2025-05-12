import { Injectable } from '@nestjs/common';
import { IDevicePermissionsRepository } from '../interfaces/device-permission';

@Injectable()
export class GetDevicePermissionByIdUseCase {
  constructor(
    private readonly devicePermissionsRepository: IDevicePermissionsRepository,
  ) {}

  async execute(id: number): Promise<any> {
    return await this.devicePermissionsRepository.findOneById(id);
  }
}
