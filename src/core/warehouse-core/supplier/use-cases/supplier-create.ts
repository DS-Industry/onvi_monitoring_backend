import { Injectable } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';
import { Supplier } from '@warehouse/supplier/domain/supplier';

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(name: string, contact: string): Promise<Supplier> {
    const supplierData = new Supplier({
      name: name,
      contact: contact,
    });
    return await this.supplierRepository.create(supplierData);
  }
}
