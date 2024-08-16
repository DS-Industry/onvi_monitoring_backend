import { DeviceRole } from '../../../platform-device/device-role/domain/device-role';
import { DeviceRole as PrismaDeviceRole } from '@prisma/client';

export class PrismaDeviceRoleMapper {
  static toDomain(prismaDeviceRole: PrismaDeviceRole): DeviceRole {
    return new DeviceRole({
      id: prismaDeviceRole.id,
      name: prismaDeviceRole.name,
    });
  }

  static toPrisma(deviceRole: DeviceRole): PrismaDeviceRole {
    return {
      id: deviceRole.id,
      name: deviceRole.name,
    };
  }
}
