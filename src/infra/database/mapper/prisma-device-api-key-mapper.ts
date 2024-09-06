import { DeviceApiKey as PrismaDeviceApiKey, Prisma } from '@prisma/client';
import { DeviceApiKey } from '@platform-device/auth/domain/api-key';

export class PrismaDeviceApiKeyMapper {
  static toDomain(entity: PrismaDeviceApiKey): DeviceApiKey {
    if (!entity) return null;

    return new DeviceApiKey({
      id: entity.id,
      key: entity.key,
      expiryAt: entity.expiryAt,
      issuedAt: entity.issuedAt,
      organizationId: entity.organizationId,
    });
  }

  static toPrisma(
    deviceApiKey: DeviceApiKey,
  ): Prisma.DeviceApiKeyUncheckedCreateInput {
    return {
      id: deviceApiKey.id,
      key: deviceApiKey.key,
      expiryAt: deviceApiKey.expiryAt,
      issuedAt: deviceApiKey.issuedAt,
      organizationId: deviceApiKey.organizationId,
    };
  }
}
