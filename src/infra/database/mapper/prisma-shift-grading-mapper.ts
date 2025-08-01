import { MNGShiftGrading as PrismaShiftGrading, Prisma } from '@prisma/client';
import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';
export class PrismaShiftGradingMapper {
  static toDomain(entity: PrismaShiftGrading): ShiftGrading {
    if (!entity) {
      return null;
    }
    return new ShiftGrading({
      id: entity.id,
      shiftReportId: entity.shiftReportId,
      gradingParameterId: entity.gradingParameterId,
      gradingEstimationId: entity.gradingEstimationId,
    });
  }
  static toPrisma(
    shiftGrading: ShiftGrading,
  ): Prisma.MNGShiftGradingUncheckedCreateInput {
    return {
      id: shiftGrading?.id,
      shiftReportId: shiftGrading.shiftReportId,
      gradingParameterId: shiftGrading.gradingParameterId,
      gradingEstimationId: shiftGrading?.gradingEstimationId,
    };
  }
}
