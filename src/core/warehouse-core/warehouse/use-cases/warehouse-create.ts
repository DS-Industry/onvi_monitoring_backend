import { Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { WarehouseCreateDto } from '@warehouse/warehouse/use-cases/dto/warehouse-create.dto';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateWarehouseUseCase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async execute(input: WarehouseCreateDto, user: User): Promise<Warehouse> {
    const warehouseData = new Warehouse({
      name: input.name,
      location: input.location,
      managerId: input.managerId,
      posId: input.posId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });
    return await this.warehouseRepository.create(warehouseData);
  }
}
