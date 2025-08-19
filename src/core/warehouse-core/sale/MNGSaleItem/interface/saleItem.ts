import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';

export abstract class ISaleItemRepository {
  abstract create(input: SaleItem): Promise<SaleItem>;
  abstract findOneById(id: number): Promise<SaleItem>;
  abstract findAllByFilter(
    nomenclatureId?: number,
    mngSaleDocumentId?: number,
    skip?: number,
    take?: number,
  ): Promise<SaleItem[]>;
  abstract update(input: SaleItem): Promise<SaleItem>;
}
