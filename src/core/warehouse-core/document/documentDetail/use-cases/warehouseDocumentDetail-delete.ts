import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/interface/warehouseDocumentDetail';

@Injectable()
export class DeleteWarehouseDocumentDetailUseCase {
  constructor(
    private readonly warehouseDocumentDetailRepository: IWarehouseDocumentDetailRepository,
  ) {}

  async deleteManyByDocumentId(documentId: number): Promise<void> {
    this.warehouseDocumentDetailRepository.deleteManyByDocumentId(documentId);
  }
}
