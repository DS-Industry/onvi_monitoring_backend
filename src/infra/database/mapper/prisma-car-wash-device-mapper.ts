import { CarWashDevice as PrismaCarWashDevice, Prisma } from '@prisma/client';
import { CarWashDevice } from '@pos/device/device/domain/device';
export type PrismaCarWashDeviceWithType = Prisma.CarWashDeviceGetPayload<{
  include: { carWashDeviceType: true };
}>;
export class PrismaCarWashDeviceMapper {
  static toDomain(
    entity: PrismaCarWashDevice | PrismaCarWashDeviceWithType,
  ): CarWashDevice {
    if (!entity) {
      return null;
    }
    const typeName =
      'carWashDeviceType' in entity && entity.carWashDeviceType
        ? entity.carWashDeviceType.name
        : undefined;
    return new CarWashDevice({
      id: entity.id,
      name: entity.name,
      carWashDeviceMetaData: entity.carWashDeviceMetaData,
      status: entity.status,
      ipAddress: entity.ipAddress,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      carWashPosId: entity.carWashPosId,
      deviceRoleId: entity.deviceRoleId,
      carWashDeviceTypeName: typeName,
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
