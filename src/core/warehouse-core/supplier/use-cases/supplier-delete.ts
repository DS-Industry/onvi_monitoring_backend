import { Injectable } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';

@Injectable()
export class DeleteSupplierUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(id: number): Promise<void> {
    await this.supplierRepository.delete(id);
  }
}
