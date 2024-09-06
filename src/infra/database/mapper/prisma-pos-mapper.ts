import { Pos as PrismaPos, Prisma } from '@prisma/client';
import { Pos } from '@pos/pos/domain/pos';
export class PrismaPosMapper {
  static toDomain(entity: PrismaPos): Pos {
    if (!entity) {
      return null;
    }
    return new Pos({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      monthlyPlan: entity.monthlyPlan,
      organizationId: entity.organizationId,
      posMetaData: entity.posMetaData,
      timezone: entity.timezone,
      addressId: entity.addressId,
      image: entity.image,
      rating: entity.rating,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
    });
  }

  static toPrisma(pos: Pos): Prisma.PosUncheckedCreateInput {
    return {
      id: pos?.id,
      name: pos.name,
      slug: pos.slug,
      monthlyPlan: pos?.monthlyPlan,
      organizationId: pos.organizationId,
      posMetaData: pos.posMetaData,
      timezone: pos.timezone,
      addressId: pos?.addressId,
      image: pos?.image,
      rating: pos?.rating,
      status: pos.status,
      createdAt: pos?.createdAt,
      updatedAt: pos?.updatedAt,
      createdById: pos.createdById,
      updateById: pos.updatedById,
    };
  }
}
