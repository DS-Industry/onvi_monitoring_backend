import { Injectable } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';

@Injectable()
export class DeleteSalePriceUseCase {
  constructor(private readonly salePriceRepository: ISalePriceRepository) {}

  async execute(input: SalePrice): Promise<void> {
    await this.salePriceRepository.delete(input.id);
  }
}
