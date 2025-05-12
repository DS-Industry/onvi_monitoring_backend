import { Provider } from '@nestjs/common';
import { IWarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/interface/warehouseDocumentDetail';
import { WarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/repository/warehouseDocumentDetail';

export const WarehouseDocumentDetailRepositoryProvider: Provider = {
  provide: IWarehouseDocumentDetailRepository,
  useClass: WarehouseDocumentDetailRepository,
};
