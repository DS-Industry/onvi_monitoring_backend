import {
  MNGGradingEstimation as PrismaGradingEstimation,
  Prisma,
} from '@prisma/client';
import { GradingEstimation } from '@finance/shiftReport/gradingEstimation/domain/gradingEstimation';
export class PrismaGradingEstimationMapper {
  static toDomain(entity: PrismaGradingEstimation): GradingEstimation {
    if (!entity) {
      return null;
    }
    return new GradingEstimation({
      id: entity.id,
      name: entity.name,
      weightPercent: entity.weightPercent,
    });
  }
  static toPrisma(
    gradingEstimation: GradingEstimation,
  ): Prisma.MNGGradingEstimationUncheckedCreateInput {
    return {
      id: gradingEstimation?.id,
      name: gradingEstimation.name,
      weightPercent: gradingEstimation.weightPercent,
    };
  }
}
