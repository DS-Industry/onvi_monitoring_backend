import { Supplier } from '@warehouse/supplier/domain/supplier';

export abstract class ISupplierRepository {
  abstract create(input: Supplier): Promise<Supplier>;
  abstract findOneById(id: number): Promise<Supplier>;
  abstract findAll(
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<Supplier[]>;
  abstract countAll(name?: string): Promise<number>;
  abstract update(input: Supplier): Promise<Supplier>;
  abstract delete(id: number): Promise<void>;
}
