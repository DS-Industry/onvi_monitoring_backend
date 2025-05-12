import { Provider } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { WarehouseDocumentRepository } from '@warehouse/document/document/repository/warehouseDocument';

export const WarehouseDocumentRepositoryProvider: Provider = {
  provide: IWarehouseDocumentRepository,
  useClass: WarehouseDocumentRepository,
};
