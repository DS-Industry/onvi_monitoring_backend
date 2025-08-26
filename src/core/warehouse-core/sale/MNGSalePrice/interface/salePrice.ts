import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';

export abstract class ISalePriceRepository {
  abstract create(input: SalePrice): Promise<SalePrice>;
  abstract createMany(input: SalePrice[]): Promise<SalePrice[]>;
  abstract findOneById(id: number): Promise<SalePrice>;
  abstract findAllByFilter(
    nomenclatureId?: number,
    warehouseId?: number,
    skip?: number,
    take?: number,
  ): Promise<SalePrice[]>;
  abstract update(input: SalePrice): Promise<SalePrice>;
  abstract updateMany(input: SalePrice[]): Promise<void>;
  abstract updateValue(id: number, price: number): Promise<SalePrice>;
}
