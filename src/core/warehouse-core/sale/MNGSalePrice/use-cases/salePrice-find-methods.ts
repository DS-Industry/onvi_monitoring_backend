import { Injectable } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { SalePriceResponseDto } from "@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-response.dto";

@Injectable()
export class FindMethodsSalePriceUseCase {
  constructor(private readonly salePriceRepository: ISalePriceRepository) {}

  async getById(input: number): Promise<SalePrice> {
    return await this.salePriceRepository.findOneById(input);
  }

  async getAllByFilter(data: {
    nomenclatureId?: number;
    warehouseId?: number;
    skip?: number;
    take?: number;
  }): Promise<SalePriceResponseDto[]> {
    return await this.salePriceRepository.findAllByFilter(
      data.nomenclatureId,
      data.warehouseId,
      data.skip,
      data.take,
    );
  }
}
