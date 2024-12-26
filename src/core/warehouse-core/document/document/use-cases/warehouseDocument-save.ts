import { Injectable } from '@nestjs/common';
import { CreateWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-create';
import { WarehouseDocumentSaveDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-save.dto';
import { User } from '@platform-user/user/domain/user';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { DeleteWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-delete';
import { UpdateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-update';
import { WarehouseDocumentStatus } from '@prisma/client';

@Injectable()
export class SaveWarehouseDocumentUseCase {
  constructor(
    private readonly createWarehouseDocumentDetailUseCase: CreateWarehouseDocumentDetailUseCase,
    private readonly updateWarehouseDocumentUseCase: UpdateWarehouseDocumentUseCase,
    private readonly deleteWarehouseDocumentDetailUseCase: DeleteWarehouseDocumentDetailUseCase,
  ) {}

  async execute(
    oldDocument: WarehouseDocument,
    input: WarehouseDocumentSaveDto,
    user: User,
  ): Promise<{ status: string; newDocument: WarehouseDocument }> {
    const updateData = {
      warehouseId: input?.warehouseId,
      responsibleId: input?.responsibleId,
      carryingAt: input?.carryingAt,
      status: WarehouseDocumentStatus.SAVED,
    };
    const warehouseDocument = await this.updateWarehouseDocumentUseCase.execute(
      updateData,
      oldDocument,
      user,
    );
    await this.deleteWarehouseDocumentDetailUseCase.deleteManyByDocumentId(
      warehouseDocument.id,
    );
    const detailsWithDocumentId = input.details.map((detail) => ({
      ...detail,
      warehouseDocumentId: warehouseDocument.id,
    }));
    await this.createWarehouseDocumentDetailUseCase.createMany(
      detailsWithDocumentId,
    );
    return { status: 'SAVE', newDocument: warehouseDocument };
  }
}
