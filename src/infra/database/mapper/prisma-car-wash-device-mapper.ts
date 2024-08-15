import { CarWashDevice as PrismaCarWashDevice, Prisma } from '@prisma/client';
import { CarWashDevice } from '../../../platform-device/car-wash-device/domain/car-wash-device';

export class PrismaCarWashDeviceMapper {
  static toDomain(entity: PrismaCarWashDevice): CarWashDevice {
    if (!entity) return null;

    return new CarWashDevice({
      id: entity.id,
      name: entity.name,
      carWashDeviceMetaData: entity.carWashDeviceMetaData,
      status: entity.status,
      ipAddress: entity.ipAddress,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      deviceRoleId: entity.deviceRoleId,
    });
  }

  static toPrisma(
    device: CarWashDevice,
  ): Prisma.CarWashDeviceUncheckedCreateInput {
    return {
      id: device?.id,
      name: device?.name,
      carWashDeviceMetaData: device?.carWashDeviceMetaData,
      status: device?.status,
      ipAddress: device?.ipAddress,
      carWashDeviceTypeId: device?.carWashDeviceTypeId,
      deviceRoleId: device?.deviceRoleId,
    };
  }
}
