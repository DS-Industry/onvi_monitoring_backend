import { Injectable } from '@nestjs/common';
import { CreateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-create';
import { CreateWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-create';
import { WarehouseDocumentCarryingDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-carrying.dto';
import { User } from '@platform-user/user/domain/user';
import { WarehouseDocumentType } from '@prisma/client';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { CreateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-create';
import { UpdateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-update';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { WarehouseDocumentDetailCreateDto } from '@platform-user/core-controller/dto/receive/warehouse-document-create.dto';

@Injectable()
export class CarryingWarehouseDocumentUseCase {
  constructor(
    private readonly createWarehouseDocumentUseCase: CreateWarehouseDocumentUseCase,
    private readonly createWarehouseDocumentDetailUseCase: CreateWarehouseDocumentDetailUseCase,
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
    private readonly createInventoryItemUseCase: CreateInventoryItemUseCase,
    private readonly updateInventoryItemUseCase: UpdateInventoryItemUseCase,
  ) {}

  async execute(input: WarehouseDocumentCarryingDto, user: User): Promise<any> {
    const updatedInventoryItems: InventoryItem[] = [];
    const inventoryItems =
      await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
        input.warehouseId,
      );

    const createdItemsOnCurrentWarehouse = await this.ensureInventoryItemsExist(
      input.details,
      inventoryItems,
      input.warehouseId,
    );

    inventoryItems.push(...createdItemsOnCurrentWarehouse);

    let receiverInventoryItems: InventoryItem[] = [];
    if (
      input.type === WarehouseDocumentType.MOVING &&
      'warehouseReceirId' in input.details[0].metaData
    ) {
      receiverInventoryItems =
        await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
          input.details[0].metaData.warehouseReceirId,
        );
      const createdItemsOnReceiverWarehouse =
        await this.ensureInventoryItemsExist(
          input.details,
          receiverInventoryItems,
          input.details[0].metaData.warehouseReceirId,
        );
      receiverInventoryItems.push(...createdItemsOnReceiverWarehouse);
    }

    await Promise.all(
      input.details.map(async (detail) => {
        const inventoryItem = inventoryItems.find(
          (item) => item.nomenclatureId === detail.nomenclatureId,
        );
        if (
          input.type == WarehouseDocumentType.COMMISSIONING ||
          input.type == WarehouseDocumentType.WRITEOFF
        ) {
          inventoryItem.adjustQuantity(-detail.quantity);
        } else if (input.type == WarehouseDocumentType.INVENTORY) {
          inventoryItem.quantity = detail.quantity;
        } else if (input.type == WarehouseDocumentType.RECEIPT) {
          inventoryItem.adjustQuantity(detail.quantity);
        } else if (input.type == WarehouseDocumentType.MOVING) {
          inventoryItem.adjustQuantity(-detail.quantity);
          const receiverItem = receiverInventoryItems.find(
            (item) => item.nomenclatureId === detail.nomenclatureId,
          );
          receiverItem.adjustQuantity(detail.quantity);
          updatedInventoryItems.push(receiverItem);
        }
        updatedInventoryItems.push(inventoryItem);
      }),
    );

    await this.updateInventoryItemUseCase.updateMany(updatedInventoryItems);
    const warehouseDocument = await this.createWarehouseDocumentUseCase.execute(
      {
        name: input.name,
        type: input.type,
        warehouseId: input.warehouseId,
        responsibleId: input.responsibleId,
        carryingAt: input.carryingAt,
      },
      user,
    );

    const detailsWithDocumentId = input.details.map((detail) => ({
      ...detail,
      warehouseDocumentId: warehouseDocument.id,
    }));
    await this.createWarehouseDocumentDetailUseCase.createMany(
      detailsWithDocumentId,
    );
    return warehouseDocument;
  }

  private async ensureInventoryItemsExist(
    details: WarehouseDocumentDetailCreateDto[],
    existingInventoryItems: InventoryItem[],
    warehouseId: number,
  ): Promise<InventoryItem[]> {
    const existingNomenclatureIds = new Set(
      existingInventoryItems.map((item) => item.nomenclatureId),
    );
    const missingNomenclatureIds = details
      .map((detail) => detail.nomenclatureId)
      .filter((nomenclatureId) => !existingNomenclatureIds.has(nomenclatureId));

    return await Promise.all(
      missingNomenclatureIds.map((nomenclatureId) =>
        this.createInventoryItemUseCase.execute({
          nomenclatureId,
          warehouseId,
        }),
      ),
    );
  }
}
