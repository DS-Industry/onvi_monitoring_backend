import { TechTaskTag as PrismaTechTaskTag, Prisma } from '@prisma/client';
import { TechTag } from '@tech-task/tag/domain/techTag';

export class PrismaTechTagMapper {
  static toDomain(entity: PrismaTechTaskTag): TechTag {
    if (!entity) {
      return null;
    }
    return new TechTag({
      id: entity.id,
      name: entity.name,
      code: entity.code,
    });
  }

  static toPrisma(techTag: TechTag): Prisma.TechTaskTagUncheckedCreateInput {
    return {
      id: techTag?.id,
      name: techTag.name,
      code: techTag?.code,
    };
  }
}
