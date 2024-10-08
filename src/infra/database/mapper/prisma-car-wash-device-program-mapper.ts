import {
  CarWashDeviceProgramsEvent as PrismaCarWashDeviceProgram,
  Prisma,
} from '@prisma/client';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
export class PrismaCarWashDeviceProgramMapper {
  static toDomain(entity: PrismaCarWashDeviceProgram): DeviceProgram {
    if (!entity) {
      return null;
    }
    return new DeviceProgram({
      id: entity.id,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceProgramsTypeId: entity.carWashDeviceProgramsTypeId,
      beginDate: entity.beginDate,
      loadDate: entity.loadDate,
      endDate: entity.endDate,
      confirm: entity.confirm,
      isPaid: entity.isPaid,
      localId: entity.localId,
      isAgregate: entity.isAgregate,
      minute: entity.minute,
      errNumId: entity.errNumId,
    });
  }

  static toPrisma(
    deviceProgram: DeviceProgram,
  ): Prisma.CarWashDeviceProgramsEventUncheckedCreateInput {
    return {
      id: deviceProgram?.id,
      carWashDeviceId: deviceProgram?.carWashDeviceId,
      carWashDeviceProgramsTypeId: deviceProgram?.carWashDeviceProgramsTypeId,
      beginDate: deviceProgram.beginDate,
      loadDate: deviceProgram.loadDate,
      endDate: deviceProgram.endDate,
      confirm: deviceProgram.confirm,
      isPaid: deviceProgram.isPaid,
      localId: deviceProgram.localId,
      isAgregate: deviceProgram?.isAgregate,
      minute: deviceProgram?.minute,
      errNumId: deviceProgram?.errNumId,
    };
  }
}
