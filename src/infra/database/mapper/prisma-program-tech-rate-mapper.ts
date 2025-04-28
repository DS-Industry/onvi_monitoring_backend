import {
  ProgramTechRate as PrismaProgramTechRate,
  Prisma,
} from '@prisma/client';
import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';

export class PrismaProgramTechRateMapper {
  static toDomain(entity: PrismaProgramTechRate): ProgramTechRate {
    if (!entity) {
      return null;
    }
    return new ProgramTechRate({
      id: entity.id,
      carWashPosId: entity.carWashPosId,
      carWashDeviceProgramsTypeId: entity.carWashDeviceProgramsTypeId,
      literRate: entity.literRate,
      concentration: entity.concentration,
    });
  }

  static toPrisma(
    programTechRate: ProgramTechRate,
  ): Prisma.ProgramTechRateUncheckedCreateInput {
    return {
      id: programTechRate?.id,
      carWashPosId: programTechRate.carWashPosId,
      carWashDeviceProgramsTypeId: programTechRate.carWashDeviceProgramsTypeId,
      literRate: programTechRate?.literRate,
      concentration: programTechRate?.concentration,
    };
  }
}
