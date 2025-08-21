import { Injectable } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';
import { Supplier } from '@warehouse/supplier/domain/supplier';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(
    input: { name?: string; contact?: string },
    oldSupplier: Supplier,
  ): Promise<Supplier> {
    const { name, contact } = input;

    oldSupplier.name = name ? name : oldSupplier.name;
    oldSupplier.contact = contact ? contact : oldSupplier.contact;

    return await this.supplierRepository.update(oldSupplier);
  }
}
