import { Provider } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { SalePriceRepository } from '@warehouse/sale/MNGSalePrice/repository/salePrice';

export const SalePriceRepositoryProvider: Provider = {
  provide: ISalePriceRepository,
  useClass: SalePriceRepository,
};
