import { Injectable } from '@nestjs/common';
import { IDevicePermissionsRepository } from '../interfaces/device-permission';

@Injectable()
export class GetAllDevicePermissionsUseCase {
  constructor(
    private readonly devicePermissionsRepository: IDevicePermissionsRepository,
  ) {}

  async execute(): Promise<any> {
    return await this.devicePermissionsRepository.findAll();
  }
}
