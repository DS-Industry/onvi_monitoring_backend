import { TechConsumables as PrismaTechConsumables, Prisma } from "@prisma/client";
import { TechConsumables } from "@tech-report/techConsumables/domain/techConsumables";

export class PrismaTechConsumablesMapper {
  static toDomain(entity: PrismaTechConsumables): TechConsumables {
    if (!entity) {
      return null;
    }
    return new TechConsumables({
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      posId: entity.posId,
      type: entity.type,
    })
  }

  static toPrisma(techConsumables: TechConsumables): Prisma.TechConsumablesUncheckedCreateInput {
    return {
      id: techConsumables?.id,
      nomenclatureId: techConsumables.nomenclatureId,
      posId: techConsumables.posId,
      type: techConsumables.type,
    }
  }
}