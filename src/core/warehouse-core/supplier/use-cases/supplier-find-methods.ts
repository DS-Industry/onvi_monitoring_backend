import { Injectable } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';
import { Supplier } from '@warehouse/supplier/domain/supplier';

@Injectable()
export class FindMethodsSupplierUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async getById(input: number): Promise<Supplier> {
    return await this.supplierRepository.findOneById(input);
  }
}
