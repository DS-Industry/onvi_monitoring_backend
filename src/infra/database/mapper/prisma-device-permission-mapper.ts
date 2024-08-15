import { DevicePermission } from '../../../platform-device/device-permissions/domain/device-permission';

export class PrismaDevicePermissionMapper {
  static toPrisma(domain: DevicePermission) {
    return {
      action: domain.action,
      objectId: domain.objectId,
      condition: domain.condition,
    };
  }

  static toDomain(prismaEntity: any): DevicePermission {
    return new DevicePermission({
      id: prismaEntity.id,
      action: prismaEntity.action,
      objectId: prismaEntity.objectId,
      condition: prismaEntity.condition,
    });
  }
}
