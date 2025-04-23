import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { WarehouseDocumentUpdateDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-update.dto';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class UpdateWarehouseDocumentUseCase {
  constructor(
    private readonly warehouseDocumentRepository: IWarehouseDocumentRepository,
  ) {}

  async execute(
    input: WarehouseDocumentUpdateDto,
    oldDocument: WarehouseDocument,
    user: User,
  ): Promise<WarehouseDocument> {
    const { warehouseId, responsibleId, carryingAt, status } = input;

    oldDocument.warehouseId = warehouseId
      ? warehouseId
      : oldDocument.warehouseId;
    oldDocument.responsibleId = responsibleId
      ? responsibleId
      : oldDocument.responsibleId;
    oldDocument.carryingAt = carryingAt ? carryingAt : oldDocument.carryingAt;
    oldDocument.status = status ? status : oldDocument.status;

    oldDocument.updatedAt = new Date(Date.now());
    oldDocument.updatedById = user.id;
    return await this.warehouseDocumentRepository.update(oldDocument);
  }
}
