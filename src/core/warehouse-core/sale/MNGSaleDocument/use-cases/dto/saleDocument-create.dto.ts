import { User } from '@platform-user/user/domain/user';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

export class SaleDocumentCreateDto {
  warehouse: Warehouse;
  manager: User;
  saleDate: Date;
  items: SaleDocumentItem[];
}

export class SaleDocumentItem {
  nomenclatureId: number;
  quantity: number;
  fullSum: number;
}
