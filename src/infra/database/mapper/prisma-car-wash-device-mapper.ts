import { CarWashDevice as PrismaCarWashDevice, Prisma } from '@prisma/client';
import { CarWashDevice } from '@device/device/domain/device';
export class PrismaCarWashDeviceMapper {
  static toDomain(entity: PrismaCarWashDevice): CarWashDevice {
    if (!entity) {
      return null;
    }
    return new CarWashDevice({
      id: entity.id,
      name: entity.name,
      carWashDeviceMetaData: entity.carWashDeviceMetaData,
      status: entity.status,
      ipAddress: entity.ipAddress,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      carWashPosId: entity.carWashPosId,
      deviceRoleId: entity.deviceRoleId,
    });
  }

  static toPrisma(
    carWashDevice: CarWashDevice,
  ): Prisma.CarWashDeviceUncheckedCreateInput {
    return {
      id: carWashDevice?.id,
      name: carWashDevice.name,
      carWashDeviceMetaData: carWashDevice.carWashDeviceMetaData,
      status: carWashDevice.status,
      ipAddress: carWashDevice.ipAddress,
      carWashDeviceTypeId: carWashDevice.carWashDeviceTypeId,
      carWashPosId: carWashDevice.carWashPosId,
      deviceRoleId: carWashDevice.deviceRoleId,
    };
  }
}
