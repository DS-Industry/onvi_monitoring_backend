import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { SaleDocumentResponseDto } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-response.dto';

export abstract class ISaleDocumentRepository {
  abstract create(input: SaleDocument): Promise<SaleDocumentResponseDto>;
  abstract findOneById(id: number): Promise<SaleDocumentResponseDto>;
  abstract findAllByFilter(
    name?: string,
    warehouseId?: number,
    responsibleManagerId?: number,
    dateStartSale?: Date,
    dateEndSale?: Date,
    skip?: number,
    take?: number,
  ): Promise<SaleDocumentResponseDto[]>;
  abstract update(input: SaleDocument): Promise<SaleDocument>;
}
