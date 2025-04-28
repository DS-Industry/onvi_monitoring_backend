import { IncidentInfo as PrismaIncidentInfoReason, Prisma } from '@prisma/client';
import { IncidentInfo } from '@equipment/incident/incidentInfo/domain/incidentInfo';

export class PrismaIncidentInfoMapper {
  static toDomain(entity: PrismaIncidentInfoReason): IncidentInfo {
    if (!entity) {
      return null;
    }
    return new IncidentInfo({
      id: entity.id,
      type: entity.type,
      name: entity.name,
    });
  }

  static toPrisma(
    object: IncidentInfo,
  ): Prisma.IncidentInfoUncheckedCreateInput {
    return {
      id: object?.id,
      type: object.type,
      name: object.name,
    };
  }
}
