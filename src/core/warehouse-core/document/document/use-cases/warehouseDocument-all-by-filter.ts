import { Injectable } from '@nestjs/common';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { WarehouseDocumentAllByFilterResponseDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-all-by-filter-response.dto';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { PureAbility } from '@casl/ability';

@Injectable()
export class AllByFilterWarehouseDocumentUseCase {
  constructor(
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    placementId?: number,
    warehouse?: Warehouse,
  ): Promise<WarehouseDocumentAllByFilterResponseDto[]> {
    const documents =
      await this.findMethodsWarehouseDocumentUseCase.getAllByWarehouseIdsAndDate(
        dateStart,
        dateEnd,
        ability,
        warehouse?.id,
        placementId,
      );

    return documents.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      warehouseId: document.warehouseId,
      warehouseName: document.warehouseName,
      responsibleId: document.responsibleId,
      responsibleName: document.responsibleName,
      status: document.status,
      carryingAt: document.carryingAt,
    }));
  }
}
