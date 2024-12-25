import { Injectable } from '@nestjs/common';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { WarehouseDocumentAllByFilterResponseDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-all-by-filter-response.dto';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';

@Injectable()
export class AllByFilterWarehouseDocumentUseCase {
  constructor(
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    warehouse?: Warehouse,
  ): Promise<WarehouseDocumentAllByFilterResponseDto[]> {
    const response: WarehouseDocumentAllByFilterResponseDto[] = [];
    let warehouses: Warehouse[] = [];
    if (warehouse) {
      warehouses.push(warehouse);
    } else {
      warehouses =
        await this.findMethodsWarehouseUseCase.geyAllByPermission(ability);
    }
    await Promise.all(
      warehouses.map(async (warehouse) => {
        const documents =
          await this.findMethodsWarehouseDocumentUseCase.getAllByWarehouseIdAndDate(
            warehouse.id,
            dateStart,
            dateEnd,
          );
        documents.map((document) => {
          response.push({
            id: document.id,
            name: document.name,
            type: document.type,
            warehouseId: document.warehouseId,
            responsibleId: document.responsibleId,
            status: document.status,
            carryingAt: document.carryingAt,
          });
        });
      }),
    );
    return response;
  }
}
