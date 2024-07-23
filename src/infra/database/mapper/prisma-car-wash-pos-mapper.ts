import { CarWashPos as PrismaCarWashPos, Prisma } from '@prisma/client';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

export class PrismaCarWashPosMapper {
  static toDomain(entity: PrismaCarWashPos): CarWashPos {
    if (!entity) {
      return null;
    }
    return new CarWashPos({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      posId: entity.posId,
    });
  }

  static toPrisma(
    carWashPos: CarWashPos,
  ): Prisma.CarWashPosUncheckedCreateInput {
    return {
      id: carWashPos?.id,
      name: carWashPos.name,
      slug: carWashPos.slug,
      posId: carWashPos.posId,
    };
  }
}
