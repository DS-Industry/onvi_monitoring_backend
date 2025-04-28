import {
  CarWashDeviceMfuEvent as PrismaCarWashDeviceMfuEvent,
  Prisma,
} from '@prisma/client';
import { DeviceMfy } from '@pos/device/device-data/device-data/device-mfu/domain/device-mfu';

export class PrismaCarWashDeviceMfuMapper {
  static toDomain(entity: PrismaCarWashDeviceMfuEvent): DeviceMfy {
    if (!entity) {
      return null;
    }
    return new DeviceMfy({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      cashIn: entity.cashIn,
      coinOut: entity.coinOut,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      loadDate: entity.loadDate,
      localId: entity.localId,
      errNumId: entity.errNumId,
    });
  }

  static toPrisma(
    deviceMfy: DeviceMfy,
  ): Prisma.CarWashDeviceMfuEventUncheckedCreateInput {
    return {
      id: deviceMfy?.id,
      carWashDeviceId: deviceMfy.carWashDeviceId,
      cashIn: deviceMfy.cashIn,
      coinOut: deviceMfy.coinOut,
      beginDate: deviceMfy.beginDate,
      endDate: deviceMfy.endDate,
      loadDate: deviceMfy.loadDate,
      localId: deviceMfy.localId,
      errNumId: deviceMfy.errNumId,
    };
  }
}
