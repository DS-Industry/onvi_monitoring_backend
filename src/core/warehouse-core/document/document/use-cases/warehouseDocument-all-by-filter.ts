import { Injectable } from '@nestjs/common';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { WarehouseDocumentAllByFilterResponseDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-all-by-filter-response.dto';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { Abilities } from '@casl/ability';

@Injectable()
export class AllByFilterWarehouseDocumentUseCase {
  constructor(
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: Abilities[0],
    placementId: number | '*',
    warehouse?: Warehouse,
  ): Promise<WarehouseDocumentAllByFilterResponseDto[]> {
    let warehouses: Warehouse[] = [];

    if (warehouse) {
      warehouses = [warehouse];
    } else {
      warehouses = await this.findMethodsWarehouseUseCase.geyAllByPermission(
        ability,
        placementId,
      );
    }

    const warehouseIds = warehouses.map((w) => w.id);

    const documents =
      await this.findMethodsWarehouseDocumentUseCase.getAllByWarehouseIdsAndDate(
        warehouseIds,
        dateStart,
        dateEnd,
      );

    return documents.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      warehouseId: document.warehouseId,
      responsibleId: document.responsibleId,
      status: document.status,
      carryingAt: document.carryingAt,
    }));
  }
}
