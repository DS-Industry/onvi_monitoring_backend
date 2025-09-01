import { Injectable } from '@nestjs/common';
import { ISaleItemRepository } from '@warehouse/sale/MNGSaleItem/interface/saleItem';
import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';
import { SaleItemCreateDto } from '@warehouse/sale/MNGSaleItem/use-cases/dto/saleItem-create.dto';

@Injectable()
export class CreateSaleItemUseCase {
  constructor(private readonly saleItemRepository: ISaleItemRepository) {}

  async executeMany(inputs: SaleItemCreateDto[]): Promise<SaleItem[]> {
    const saleItemsData = inputs.map(
      (item) =>
        new SaleItem({
          nomenclatureId: item.nomenclatureId,
          mngSaleDocumentId: item.mngSaleDocumentId,
          count: item.count,
          fullSum: item.fullSum,
        }),
    );
    return await this.saleItemRepository.createMany(saleItemsData);
  }
}
