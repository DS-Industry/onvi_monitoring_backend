import {
  MNGGradingParameter as PrismaGradingParameter,
  Prisma,
} from '@prisma/client';
import { GradingParameter } from '@finance/shiftReport/gradingParameter/domain/gradingParameter';
export class PrismaGradingParameterMapper {
  static toDomain(entity: PrismaGradingParameter): GradingParameter {
    if (!entity) {
      return null;
    }
    return new GradingParameter({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      weightPercent: entity.weightPercent,
    });
  }
  static toPrisma(
    gradingParameter: GradingParameter,
  ): Prisma.MNGGradingParameterUncheckedCreateInput {
    return {
      id: gradingParameter?.id,
      name: gradingParameter.name,
      description: gradingParameter?.description,
      weightPercent: gradingParameter.weightPercent,
    };
  }
}
