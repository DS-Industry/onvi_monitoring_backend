import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/interface/warehouseDocumentDetail';
import { WarehouseDocumentDetail } from '@warehouse/document/documentDetail/domain/warehouseDocumentDetail';

@Injectable()
export class FindMethodsWarehouseDocumentDetailUseCase {
  constructor(
    private readonly warehouseDocumentDetailRepository: IWarehouseDocumentDetailRepository,
  ) {}

  async getOneById(id: number): Promise<WarehouseDocumentDetail> {
    return await this.warehouseDocumentDetailRepository.findOneById(id);
  }

  async getAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<WarehouseDocumentDetail[]> {
    return await this.warehouseDocumentDetailRepository.findAllByNomenclatureId(
      nomenclatureId,
    );
  }

  async getAllByWarehouseDocumentId(
    warehouseDocumentId: number,
  ): Promise<WarehouseDocumentDetail[]> {
    return await this.warehouseDocumentDetailRepository.findAllByWarehouseDocumentId(
      warehouseDocumentId,
    );
  }
}
