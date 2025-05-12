import { ProgramChange as PrismaProgramChange, Prisma } from '@prisma/client';
import { DeviceProgramChange } from '@pos/device/device-data/device-data/device-program/device-program-change/domain/device-program-change';

export class PrismaDeviceProgramChangeMapper {
  static toDomain(entity: PrismaProgramChange): DeviceProgramChange {
    if (!entity) {
      return null;
    }
    return new DeviceProgramChange({
      id: entity.id,
      carWashPosId: entity.carWashPosId,
      carWashDeviceId: entity.carWashDeviceId,
      carWashDeviceProgramsTypeFromId: entity.carWashDeviceProgramsTypeFromId,
      carWashDeviceProgramsTypeToId: entity.carWashDeviceProgramsTypeToId,
    });
  }

  static toPrisma(
    deviceProgramChange: DeviceProgramChange,
  ): Prisma.ProgramChangeUncheckedCreateInput {
    return {
      id: deviceProgramChange?.id,
      carWashPosId: deviceProgramChange.carWashPosId,
      carWashDeviceId: deviceProgramChange.carWashDeviceId,
      carWashDeviceProgramsTypeFromId:
        deviceProgramChange.carWashDeviceProgramsTypeFromId,
      carWashDeviceProgramsTypeToId:
        deviceProgramChange.carWashDeviceProgramsTypeToId,
    };
  }
}
