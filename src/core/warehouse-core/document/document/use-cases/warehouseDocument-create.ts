import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { WarehouseDocumentCreateDto } from '@warehouse/document/document/use-cases/dto/warehouseDocument-create.dto';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateWarehouseDocumentUseCase {
  constructor(
    private readonly warehouseDocumentRepository: IWarehouseDocumentRepository,
  ) {}

  async execute(
    input: WarehouseDocumentCreateDto,
    user: User,
  ): Promise<WarehouseDocument> {
    const warehouseDocumentData = new WarehouseDocument({
      name: input.name,
      type: input.type,
      warehouseId: input.warehouseId,
      responsibleId: input.responsibleId,
      carryingAt: input.carryingAt,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    return await this.warehouseDocumentRepository.create(warehouseDocumentData);
  }
}
