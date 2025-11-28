import {
  ManagerPaperType as PrismaManagerPaperType,
  Prisma,
} from '@prisma/client';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';

export class PrismaManagerPaperTypeMapper {
  static toDomain(entity: PrismaManagerPaperType): ManagerPaperType {
    if (!entity) {
      return null;
    }
    return new ManagerPaperType({
      id: entity.id,
      name: entity.name,
      type: entity.type,
    });
  }

  static toPrisma(
    managerPaperType: ManagerPaperType,
  ): Prisma.ManagerPaperTypeUncheckedCreateInput {
    return {
      id: managerPaperType?.id,
      name: managerPaperType.name,
      type: managerPaperType.type,
    };
  }
}
