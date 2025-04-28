import {
  CarWashDeviceServiceEvent as PrismaCarWashDeviceServiceEvent,
  Prisma,
} from '@prisma/client';
import { DeviceService } from '@pos/device/device-data/device-data/device-service/domain/device-service';

export class PrismaCarWashDeviceServiceMapper {
  static toDomain(entity: PrismaCarWashDeviceServiceEvent): DeviceService {
    if (!entity) {
      return null;
    }
    return new DeviceService({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceProgramsTypeId: entity.carWashDeviceProgramsTypeId,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      loadDate: entity.loadDate,
      counter: entity.counter.toString(),
      localId: entity.localId,
      errNumId: entity.errNumId,
    });
  }

  static toPrisma(
    deviceService: DeviceService,
  ): Prisma.CarWashDeviceServiceEventUncheckedCreateInput {
    return {
      id: deviceService?.id,
      carWashDeviceId: deviceService.carWashDeviceId,
      carWashDeviceProgramsTypeId: deviceService.carWashDeviceProgramsTypeId,
      beginDate: deviceService.beginDate,
      endDate: deviceService.endDate,
      loadDate: deviceService.loadDate,
      counter: BigInt(deviceService.counter),
      localId: deviceService.localId,
      errNumId: deviceService.errNumId,
    };
  }
}
