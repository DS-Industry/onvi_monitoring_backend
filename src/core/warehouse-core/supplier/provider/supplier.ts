import { Provider } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';
import { SupplierRepository } from '@warehouse/supplier/repository/supplier';

export const SupplierRepositoryProvider: Provider = {
  provide: ISupplierRepository,
  useClass: SupplierRepository,
};
