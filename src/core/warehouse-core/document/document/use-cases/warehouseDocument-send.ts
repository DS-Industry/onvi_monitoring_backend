import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { WarehouseDocumentStatus, WarehouseDocumentType } from '@prisma/client';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { CreateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-create';
import { UpdateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-update';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { WarehouseDocumentDetailCreateDto } from '@platform-user/core-controller/dto/receive/warehouse-document-save.dto';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { UpdateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-update';

@Injectable()
export class SandWarehouseDocumentUseCase {
  constructor(
    private readonly updateWarehouseDocumentUseCase: UpdateWarehouseDocumentUseCase,
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
    private readonly createInventoryItemUseCase: CreateInventoryItemUseCase,
    private readonly updateInventoryItemUseCase: UpdateInventoryItemUseCase,
  ) {}

  async execute(
    oldDocument: WarehouseDocument,
    details: WarehouseDocumentDetailCreateDto[],
    user: User,
  ): Promise<any> {
    const updatedInventoryItems: InventoryItem[] = [];
    const inventoryItems =
      await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
        oldDocument.warehouseId,
      );

    const createdItemsOnCurrentWarehouse = await this.ensureInventoryItemsExist(
      details,
      inventoryItems,
      oldDocument.warehouseId,
    );

    inventoryItems.push(...createdItemsOnCurrentWarehouse);

    let receiverInventoryItems: InventoryItem[] = [];
    if (
      oldDocument.type === WarehouseDocumentType.MOVING &&
      'warehouseReceirId' in details[0].metaData
    ) {
      receiverInventoryItems =
        await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
          details[0].metaData.warehouseReceirId,
        );
      const createdItemsOnReceiverWarehouse =
        await this.ensureInventoryItemsExist(
          details,
          receiverInventoryItems,
          details[0].metaData.warehouseReceirId,
        );
      receiverInventoryItems.push(...createdItemsOnReceiverWarehouse);
    }

    await Promise.all(
      details.map(async (detail) => {
        const inventoryItem = inventoryItems.find(
          (item) => item.nomenclatureId === detail.nomenclatureId,
        );
        if (
          oldDocument.type == WarehouseDocumentType.COMMISSIONING ||
          oldDocument.type == WarehouseDocumentType.WRITEOFF
        ) {
          inventoryItem.adjustQuantity(-detail.quantity);
        } else if (oldDocument.type == WarehouseDocumentType.INVENTORY) {
          inventoryItem.quantity = detail.quantity;
        } else if (oldDocument.type == WarehouseDocumentType.RECEIPT) {
          inventoryItem.adjustQuantity(detail.quantity);
        } else if (oldDocument.type == WarehouseDocumentType.MOVING) {
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
    await this.updateWarehouseDocumentUseCase.execute(
      { status: WarehouseDocumentStatus.SENT },
      oldDocument,
      user,
    );
    return { status: 'SEND' };
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
