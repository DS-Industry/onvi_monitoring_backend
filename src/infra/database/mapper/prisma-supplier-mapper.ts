import { Supplier as PrismaSupplier, Prisma } from '@prisma/client';
import { Supplier } from '@warehouse/supplier/domain/supplier';

export class PrismaSupplierMapper {
  static toDomain(entity: PrismaSupplier): Supplier {
    if (!entity) {
      return null;
    }
    return new Supplier({
      id: entity.id,
      name: entity.name,
      contact: entity.contact,
    });
  }

  static toPrisma(supplier: Supplier): Prisma.SupplierUncheckedCreateInput {
    return {
      id: supplier?.id,
      name: supplier.name,
      contact: supplier.contact,
    };
  }
}
