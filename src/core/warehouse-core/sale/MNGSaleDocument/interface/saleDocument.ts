import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';

export abstract class ISaleDocumentRepository {
  abstract create(input: SaleDocument): Promise<SaleDocument>;
  abstract findOneById(id: number): Promise<SaleDocument>;
  abstract findAllByFilter(
    warehouseId?: number,
    responsibleManagerId?: number,
    dateStartSale?: Date,
    dateEndSale?: Date,
    skip?: number,
    take?: number,
  ): Promise<SaleDocument[]>;
  abstract update(input: SaleDocument): Promise<SaleDocument>;
}
