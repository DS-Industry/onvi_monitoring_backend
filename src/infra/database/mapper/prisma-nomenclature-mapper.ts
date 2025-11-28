import { Nomenclature as PrismaNomenclature, Prisma } from '@prisma/client';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { NomenclatureMeta } from '@warehouse/nomenclature/interface/nomenclatureMeta';

export class PrismaNomenclatureMapper {
  static toDomain(entity: PrismaNomenclature): Nomenclature {
    if (!entity) {
      return null;
    }

    let parsedMetaData: NomenclatureMeta | undefined;

    if (typeof entity.metaData === 'object' && entity.metaData !== null) {
      parsedMetaData = entity.metaData as unknown as NomenclatureMeta;
    } else if (typeof entity.metaData === 'string') {
      try {
        parsedMetaData = JSON.parse(entity.metaData) as NomenclatureMeta;
      } catch (error) {
        parsedMetaData = undefined;
      }
    }

    return new Nomenclature({
      id: entity.id,
      name: entity.name,
      sku: entity.sku,
      organizationId: entity.organizationId,
      categoryId: entity.categoryId,
      supplierId: entity.supplierId,
      measurement: entity.measurement,
      destiny: entity.destiny,
      image: entity.image,
      status: entity.status,
      metaData: parsedMetaData,
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
      measurement: nomenclature.measurement,
      destiny: nomenclature.destiny,
      image: nomenclature?.image,
      status: nomenclature.status,
      metaData: nomenclature.metaData
        ? JSON.stringify(nomenclature.metaData)
        : null,
      createdAt: nomenclature.createdAt,
      createdById: nomenclature.createdById,
      updatedAt: nomenclature.updatedAt,
      updateById: nomenclature.updatedById,
    };
  }
}
