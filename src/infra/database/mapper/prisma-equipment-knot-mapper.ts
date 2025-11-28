import { EquipmentKnot as PrismaEquipmentKnot, Prisma } from '@prisma/client';
import { EquipmentKnot } from '@equipment/equipmentKnot/domain/equipmentKnot';

export class PrismaEquipmentKnotMapper {
  static toDomain(entity: PrismaEquipmentKnot): EquipmentKnot {
    if (!entity) {
      return null;
    }
    return new EquipmentKnot({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    object: EquipmentKnot,
  ): Prisma.EquipmentKnotUncheckedCreateInput {
    return {
      id: object?.id,
      name: object.name,
    };
  }
}
