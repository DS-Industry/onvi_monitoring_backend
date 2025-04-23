import { HrPosition as PrismaHrPosition, Prisma } from '@prisma/client';
import { Position } from '@hr/position/domain/position';

export class PrismaHrPositionMapper {
  static toDomain(entity: PrismaHrPosition): Position {
    if (!entity) {
      return null;
    }
    return new Position({
      id: entity.id,
      name: entity.name,
      organizationId: entity.organizationId,
      description: entity.description,
    });
  }

  static toPrisma(position: Position): Prisma.HrPositionUncheckedCreateInput {
    return {
      id: position?.id,
      name: position.name,
      organizationId: position.organizationId,
      description: position?.description,
    };
  }
}
