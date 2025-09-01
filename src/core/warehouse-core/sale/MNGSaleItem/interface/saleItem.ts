import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';
import { SaleItemResponseDto } from "@warehouse/sale/MNGSaleItem/use-cases/dto/saleItem-response.dto";

export abstract class ISaleItemRepository {
  abstract create(input: SaleItem): Promise<SaleItem>;
  abstract createMany(input: SaleItem[]): Promise<SaleItem[]>;
  abstract findOneById(id: number): Promise<SaleItem>;
  abstract findAllByFilter(
    nomenclatureId?: number,
    mngSaleDocumentId?: number,
    skip?: number,
    take?: number,
  ): Promise<SaleItemResponseDto[]>;
  abstract update(input: SaleItem): Promise<SaleItem>;
}
