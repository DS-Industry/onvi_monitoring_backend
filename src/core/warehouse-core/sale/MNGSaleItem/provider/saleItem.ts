import { Provider } from '@nestjs/common';
import { ISaleItemRepository } from '@warehouse/sale/MNGSaleItem/interface/saleItem';
import { SaleItemRepository } from '@warehouse/sale/MNGSaleItem/repository/saleItem';

export const SaleItemRepositoryProvider: Provider = {
  provide: ISaleItemRepository,
  useClass: SaleItemRepository,
};
