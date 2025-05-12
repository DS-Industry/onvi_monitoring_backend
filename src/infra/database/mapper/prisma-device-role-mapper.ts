import { DeviceRole as PrismaDeviceRole, Prisma } from '@prisma/client';
import { DeviceRole } from '@platform-device/device-role/domain/device-role';

export class PrismaDeviceRoleMapper {
  static toDomain(prismaDeviceRole: PrismaDeviceRole): DeviceRole {
    return new DeviceRole({
      id: prismaDeviceRole.id,
      name: prismaDeviceRole.name,
    });
  }

  static toPrisma(
    deviceRole: DeviceRole,
  ): Prisma.DeviceRoleUncheckedCreateInput {
    return {
      id: deviceRole.id,
      name: deviceRole.name,
    };
  }
}
