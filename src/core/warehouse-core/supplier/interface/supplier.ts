import { Supplier } from '@warehouse/supplier/domain/supplier';

export abstract class ISupplierRepository {
  abstract create(input: Supplier): Promise<Supplier>;
  abstract findOneById(id: number): Promise<Supplier>;
  abstract update(input: Supplier): Promise<Supplier>;
}
