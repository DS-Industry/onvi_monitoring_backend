import { Injectable } from '@nestjs/common';
import { ISaleItemRepository } from '@warehouse/sale/MNGSaleItem/interface/saleItem';
import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';

@Injectable()
export class FindMethodsSaleItemUseCase {
  constructor(private readonly saleItemRepository: ISaleItemRepository) {}

  async getById(input: number): Promise<SaleItem> {
    return await this.saleItemRepository.findOneById(input);
  }

  async getAllByFilter(data: {
    nomenclatureId?: number;
    mngSaleDocumentId?: number;
    skip?: number;
    take?: number;
  }): Promise<SaleItem[]> {
    return await this.saleItemRepository.findAllByFilter(
      data.nomenclatureId,
      data.mngSaleDocumentId,
      data.skip,
      data.take,
    );
  }
}
