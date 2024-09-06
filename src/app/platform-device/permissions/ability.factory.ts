import { Injectable } from '@nestjs/common';
import { AbilityBuilder } from '@casl/ability';
import { GetDeviceRoleByIdUseCase } from '../device-role/use-cases/device-role-get-by-id';
import { GetPermissionsByRoleIdUseCase } from '../device-role/use-cases/device-role-get-permission-by-id';
import { createPrismaAbility } from '@casl/prisma';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { CarWashDevice } from '@prisma/client';

@Injectable()
export class CarWashDeviceAbilityFactory {
  constructor(
    private readonly roleGetById: GetDeviceRoleByIdUseCase,
    private readonly roleGetPermissionsById: GetPermissionsByRoleIdUseCase,
    private readonly carWashDeviceGetById: GetByIdCarWashDeviceUseCase,
  ) {}

  async createForCarWashDevice(device: CarWashDevice): Promise<any> {
    const role = await this.roleGetById.execute(device.deviceRoleId);
    const permissions = await this.roleGetPermissionsById.execute(role.id);

    const objectMap = {};
    for (const permission of permissions) {
      if (!objectMap[permission.objectId]) {
        objectMap[permission.objectId] =
          await this.carWashDeviceGetById.execute(permission.objectId);
      }
    }

    const dbPermissions = permissions.map((permission) => ({
      id: permission.id,
      action: permission.action,
      condition: permission.condition,
      permissionObject: objectMap[permission.objectId],
    }));

    const abilityBuilder = new AbilityBuilder(createPrismaAbility);

    for (const p of dbPermissions) {
      abilityBuilder.can(p.action, p.permissionObject.name, p.condition);
    }

    return abilityBuilder.build();
  }
}
