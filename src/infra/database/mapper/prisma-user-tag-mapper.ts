import { UserTag as PrismaUserTag, Prisma } from '@prisma/client';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';

export class PrismaUserTagMapper {
  static toDomain(entity: PrismaUserTag): Tag {
    if (!entity) {
      return null;
    }
    return new Tag({
      id: entity.id,
      name: entity.name,
      color: entity.color,
    });
  }

  static toPrisma(tag: Tag): Prisma.UserTagUncheckedCreateInput {
    return {
      id: tag?.id,
      name: tag.name,
      color: tag.color,
    };
  }
}
