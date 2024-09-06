import {
  CarWashDeviceProgramsType as PrismaCarWashDeviceProgramsType,
  Prisma,
} from '@prisma/client';
import { DeviceProgramType } from '@device/device-program/device-program-type/domain/device-program-type';

export class PrismaCarWashDeviceProgramTypeMapper {
  static toDomain(entity: PrismaCarWashDeviceProgramsType): DeviceProgramType {
    if (!entity) {
      return null;
    }
    return new DeviceProgramType({
      id: entity.id,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      name: entity.name,
      code: entity.code,
      description: entity.description,
      orderNum: entity.orderNum,
    });
  }

  static toPrisma(
    deviceProgramType: DeviceProgramType,
  ): Prisma.CarWashDeviceProgramsTypeUncheckedCreateInput {
    return {
      id: deviceProgramType?.id,
      carWashDeviceTypeId: deviceProgramType.carWashDeviceTypeId,
      name: deviceProgramType.name,
      code: deviceProgramType?.code,
      description: deviceProgramType?.description,
      orderNum: deviceProgramType?.orderNum,
    };
  }
}
