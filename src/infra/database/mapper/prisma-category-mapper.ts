import { Category as PrismaCategory, Prisma } from '@prisma/client';
import { Category } from '@warehouse/category/domain/category';

export class PrismaCategoryMapper {
  static toDomain(entity: PrismaCategory): Category {
    if (!entity) {
      return null;
    }
    return new Category({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      ownerCategoryId: entity.ownerCategoryId,
    });
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category?.id,
      name: category.name,
      description: category?.description,
      ownerCategoryId: category?.ownerCategoryId,
    };
  }
}
