import { IncidentName as PrismaIncidentName, Prisma } from '@prisma/client';
import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';

export class PrismaIncidentNameMapper {
  static toDomain(entity: PrismaIncidentName): IncidentName {
    if (!entity) {
      return null;
    }
    return new IncidentName({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    object: IncidentName,
  ): Prisma.IncidentNameUncheckedCreateInput {
    return {
      id: object?.id,
      name: object.name,
    };
  }
}
