import {
  CarWashDeviceEvent as PrismaCarWashDeviceEvent,
  Prisma,
} from '@prisma/client';
import { DeviceEvent } from '@device/device-event/device-event/domain/device-event';

export class PrismaCarWashDeviceEventMapper {
  static toDomain(entity: PrismaCarWashDeviceEvent): DeviceEvent {
    if (!entity) {
      return null;
    }
    return new DeviceEvent({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceEventTypeId: entity.carWashDeviceEventTypeId,
      eventDate: entity.eventDate,
      loadDate: entity.loadDate,
      localId: entity.localId,
      errNumId: entity.errNumId,
    });
  }

  static toPrisma(
    deviceEvent: DeviceEvent,
  ): Prisma.CarWashDeviceEventUncheckedCreateInput {
    return {
      id: deviceEvent?.id,
      carWashDeviceId: deviceEvent?.carWashDeviceId,
      carWashDeviceEventTypeId: deviceEvent?.carWashDeviceEventTypeId,
      eventDate: deviceEvent.eventDate,
      loadDate: deviceEvent.loadDate,
      localId: deviceEvent.localId,
      errNumId: deviceEvent?.errNumId,
    };
  }
}
