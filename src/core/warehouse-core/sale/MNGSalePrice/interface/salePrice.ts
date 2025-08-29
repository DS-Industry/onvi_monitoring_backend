import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { SalePriceResponseDto } from "@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-response.dto";

export abstract class ISalePriceRepository {
  abstract create(input: SalePrice): Promise<SalePriceResponseDto>;
  abstract createMany(input: SalePrice[]): Promise<SalePrice[]>;
  abstract findOneById(id: number): Promise<SalePrice>;
  abstract findAllByFilter(
    nomenclatureId?: number,
    warehouseId?: number,
    skip?: number,
    take?: number,
  ): Promise<SalePriceResponseDto[]>;
  abstract update(input: SalePrice): Promise<SalePrice>;
  abstract updateMany(input: SalePrice[]): Promise<void>;
  abstract updateValue(id: number, price: number): Promise<SalePrice>;
  abstract delete(id: number): Promise<void>;
}
