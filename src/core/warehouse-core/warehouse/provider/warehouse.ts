import { Provider } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { WarehouseRepository } from '@warehouse/warehouse/repository/warehouse';

export const WarehouseRepositoryProvider: Provider = {
  provide: IWarehouseRepository,
  useClass: WarehouseRepository,
};
