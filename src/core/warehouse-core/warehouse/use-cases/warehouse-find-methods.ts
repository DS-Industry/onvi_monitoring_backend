import { Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

@Injectable()
export class FindMethodsWarehouseUseCase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async getById(input: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOneById(input);
  }

  async getAllByPosId(posId: number): Promise<Warehouse[]> {
    return await this.warehouseRepository.findAllByPosId(posId);
  }
}
