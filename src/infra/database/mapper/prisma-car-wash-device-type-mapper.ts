import {
  CarWashDeviceType as PrismaCarWashDeviceType,
  Prisma,
} from '@prisma/client';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';

export class PrismaCarWashDeviceTypeMapper {
  static toDomain(entity: PrismaCarWashDeviceType): CarWashDeviceType {
    if (!entity) {
      return null;
    }
    return new CarWashDeviceType({
      id: entity.id,
      name: entity.name,
      code: entity.code,
    });
  }

  static toPrisma(
    carWashDeviceType: CarWashDeviceType,
  ): Prisma.CarWashDeviceTypeUncheckedCreateInput {
    return {
      id: carWashDeviceType?.id,
      name: carWashDeviceType.name,
      code: carWashDeviceType.code,
    };
  }
}
