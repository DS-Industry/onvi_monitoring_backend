import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { User } from '@platform-user/user/domain/user';
import { WarehouseDocumentStatus, WarehouseDocumentType } from '@prisma/client';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import moment from 'moment';

@Injectable()
export class CreateWarehouseDocumentUseCase {
  constructor(
    private readonly warehouseDocumentRepository: IWarehouseDocumentRepository,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
  ) {}

  async execute(
    type: WarehouseDocumentType,
    user: User,
  ): Promise<WarehouseDocument> {
    let name = '';
    do {
      name = this.generateName(type);
    } while (await this.findMethodsWarehouseDocumentUseCase.getOneByName(name));
    const warehouseDocumentData = new WarehouseDocument({
      name: name,
      type: type,
      status: WarehouseDocumentStatus.CREATED,
      carryingAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    return await this.warehouseDocumentRepository.create(warehouseDocumentData);
  }

  private generateName(type: WarehouseDocumentType): string {
    if (type == WarehouseDocumentType.MOVING) {
      return 'ПерТ-' + moment().format('YYMMDDHHmmss');
    } else if (type == WarehouseDocumentType.RECEIPT) {
      return 'ПТ-' + moment().format('YYMMDDHHmmss');
    } else if (type == WarehouseDocumentType.INVENTORY) {
      return 'ИН-' + moment().format('YYMMDDHHmmss');
    } else if (type == WarehouseDocumentType.COMMISSIONING) {
      return 'ПЭ-' + moment().format('YYMMDDHHmmss');
    } else if (type == WarehouseDocumentType.WRITEOFF) {
      return 'СТ-' + moment().format('YYMMDDHHmmss');
    }
  }
}
