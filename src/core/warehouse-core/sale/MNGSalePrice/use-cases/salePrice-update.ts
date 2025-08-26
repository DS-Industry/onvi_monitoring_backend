import { Injectable } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { SalePriceUpdateValueDto } from '@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-update-value.dto';

@Injectable()
export class UpdateSalePriceUseCase {
  constructor(private readonly salePriceRepository: ISalePriceRepository) {}

  async updateMany(input: SalePrice[]): Promise<void> {
    await this.salePriceRepository.updateMany(input);
  }

  async updateValue(input: SalePriceUpdateValueDto[]): Promise<SalePrice[]> {
    const response: SalePrice[] = [];
    for (const salePrice of input) {
      const updateSalePrice = await this.salePriceRepository.updateValue(
        salePrice.id,
        salePrice.price,
      );
      response.push(updateSalePrice);
    }
    return response;
  }
}
