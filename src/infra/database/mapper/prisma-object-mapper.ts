import { PlatformUserObjects as PrismaObject, Prisma } from '@prisma/client';
import { ObjectPermissions } from '@platform-admin/object/domain/object';

export class PrismaObjectMapper {
  static toDomain(entity: PrismaObject): ObjectPermissions {
    if (!entity) {
      return null;
    }
    return new ObjectPermissions({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    object: ObjectPermissions,
  ): Prisma.PlatformUserObjectsUncheckedCreateInput {
    return {
      id: object?.id,
      name: object.name,
    };
  }
}
