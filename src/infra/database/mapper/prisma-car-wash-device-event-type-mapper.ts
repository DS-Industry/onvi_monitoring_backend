import {
  CarWashDeviceEventType as PrismaCarWashDeviceEventType,
  Prisma,
} from '@prisma/client';
import { DeviceEventType } from '@device/device-event/device-event-type/domain/device-event-type';
export class PrismaCarWashDeviceEventTypeMapper {
  static toDomain(entity: PrismaCarWashDeviceEventType): DeviceEventType {
    if (!entity) {
      return null;
    }
    return new DeviceEventType({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    deviceEventType: DeviceEventType,
  ): Prisma.CarWashDeviceEventTypeUncheckedCreateInput {
    return {
      id: deviceEventType?.id,
      name: deviceEventType.name,
    };
  }
}
