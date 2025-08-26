import { Injectable } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { SalePriceCreateDto } from '@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-create.dto';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';

@Injectable()
export class CreateSalePriceUseCase {
  constructor(private readonly salePriceRepository: ISalePriceRepository) {}

  async execute(input: SalePriceCreateDto): Promise<SalePrice> {
    const salePriceData = new SalePrice({
      nomenclatureId: input.nomenclatureId,
      warehouseId: input.warehouseId,
      price: input.price,
    });
    return await this.salePriceRepository.create(salePriceData);
  }

  async executeMany(inputs: SalePriceCreateDto[]): Promise<SalePrice[]> {
    const salePricesData = inputs.map(
      (item) =>
        new SalePrice({
          nomenclatureId: item.nomenclatureId,
          warehouseId: item.warehouseId,
          price: item.price,
        }),
    );
    return await this.salePriceRepository.createMany(salePricesData);
  }
}
