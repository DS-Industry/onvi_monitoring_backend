import { WarehouseDocumentDetail } from '@warehouse/document/documentDetail/domain/warehouseDocumentDetail';

export abstract class IWarehouseDocumentDetailRepository {
  abstract create(
    input: WarehouseDocumentDetail,
  ): Promise<WarehouseDocumentDetail>;
  abstract createMany(input: WarehouseDocumentDetail[]): void;
  abstract deleteManyByDocumentId(documentId: number): void;
  abstract findOneById(id: number): Promise<WarehouseDocumentDetail>;
  abstract findAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<WarehouseDocumentDetail[]>;
  abstract findAllByWarehouseDocumentId(
    warehouseDocumentId: number,
  ): Promise<WarehouseDocumentDetail[]>;
  abstract update(
    input: WarehouseDocumentDetail,
  ): Promise<WarehouseDocumentDetail>;
}
