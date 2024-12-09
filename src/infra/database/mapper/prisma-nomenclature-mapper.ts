import { Nomenclature as PrismaNomenclature, Prisma } from '@prisma/client';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';

export class PrismaNomenclatureMapper {
  static toDomain(entity: PrismaNomenclature): Nomenclature {
    if (!entity) {
      return null;
    }
    return new Nomenclature({
      id: entity.id,
      name: entity.name,
      sku: entity.sku,
      organizationId: entity.organizationId,
      categoryId: entity.categoryId,
      supplierId: entity.supplierId,
      createdAt: entity.createdAt,
      createdById: entity.createdById,
      updatedAt: entity.updatedAt,
      updatedById: entity.updateById,
    });
  }

  static toPrisma(
    nomenclature: Nomenclature,
  ): Prisma.NomenclatureUncheckedCreateInput {
    return {
      id: nomenclature?.id,
      name: nomenclature.name,
      sku: nomenclature.sku,
      organizationId: nomenclature.organizationId,
      categoryId: nomenclature.categoryId,
      supplierId: nomenclature?.supplierId,
      createdAt: nomenclature.createdAt,
      createdById: nomenclature.createdById,
      updatedAt: nomenclature.updatedAt,
      updateById: nomenclature.updatedById,
    };
  }
}
