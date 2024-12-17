import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/interface/warehouseDocumentDetail';
import { WarehouseDocumentDetailCreateDto } from '@warehouse/document/documentDetail/use-cases/dto/warehouseDocumentDetail-create.dto';
import { WarehouseDocumentDetail } from '@warehouse/document/documentDetail/domain/warehouseDocumentDetail';

@Injectable()
export class CreateWarehouseDocumentDetailUseCase {
  constructor(
    private readonly warehouseDocumentDetailRepository: IWarehouseDocumentDetailRepository,
  ) {}

  async create(
    input: WarehouseDocumentDetailCreateDto,
  ): Promise<WarehouseDocumentDetail> {
    const warehouseDocumentDetail = new WarehouseDocumentDetail({
      warehouseDocumentId: input.warehouseDocumentId,
      nomenclatureId: input.nomenclatureId,
      quantity: input.quantity,
      comment: input?.comment,
      metaData: input?.metaData,
    });
    return await this.warehouseDocumentDetailRepository.create(
      warehouseDocumentDetail,
    );
  }

  async createMany(input: WarehouseDocumentDetailCreateDto[]): Promise<void> {
    const warehouseDocumentDetails: WarehouseDocumentDetail[] = [];
    await Promise.all(
      input.map((item) => {
        warehouseDocumentDetails.push(
          new WarehouseDocumentDetail({
            warehouseDocumentId: item.warehouseDocumentId,
            nomenclatureId: item.nomenclatureId,
            quantity: item.quantity,
            comment: item?.comment,
            metaData: item?.metaData,
          }),
        );
      }),
    );
    this.warehouseDocumentDetailRepository.createMany(warehouseDocumentDetails);
  }
}
