export class SaleDocumentFullResponse {
  id: number;
  name: string;
  warehouseId: number;
  warehouseName: string;
  responsibleManagerId: number;
  responsibleManagerName: string;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
  details: detailDocument[];
}

export class detailDocument {
  id: number;
  nomenclatureId: number;
  nomenclatureName: string;
  count: number;
  fullSum: number;
}
