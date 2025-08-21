import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { DeleteWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-delete';

@Injectable()
export class DeleteWarehouseDocumentUseCase {
  constructor(
    private readonly warehouseDocumentRepository: IWarehouseDocumentRepository,
    private readonly deleteWarehouseDocumentDetailUseCase: DeleteWarehouseDocumentDetailUseCase,
  ) {}

  async execute(id: number): Promise<void> {
    await this.deleteWarehouseDocumentDetailUseCase.deleteManyByDocumentId(id);
    await this.warehouseDocumentRepository.delete(id);
  }
}
