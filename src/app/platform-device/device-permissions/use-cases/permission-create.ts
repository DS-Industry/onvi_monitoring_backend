import { Injectable } from '@nestjs/common';
import { CreateDevicePermissionDto } from '../controller/dto/create-device-permission.dto';
import { DevicePermission } from '../domain/device-permission';
import { IDevicePermissionsRepository } from '../interfaces/device-permission';

@Injectable()
export class CreateDevicePermissionUseCase {
  constructor(
    private readonly devicePermissionsRepository: IDevicePermissionsRepository,
  ) {}

  async execute(input: CreateDevicePermissionDto): Promise<DevicePermission> {
    const permissionData = new DevicePermission({
      action: input.action,
      objectId: input.objectId,
    });

    const rolesId = input.roles.map((roleId) => ({ id: roleId }));

    return await this.devicePermissionsRepository.create(
      permissionData,
      rolesId,
    );
  }
}
