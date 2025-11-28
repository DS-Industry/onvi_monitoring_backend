import { Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

@Injectable()
export class FindMethodsWarehouseUseCase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async getById(input: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOneById(input);
  }

  async getAllByPosId(
    posId: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]> {
    return await this.warehouseRepository.findAllByPosId(posId, skip, take);
  }

  async getCountAllByPosId(posId: number): Promise<{ count: number }> {
    const count = await this.warehouseRepository.findCountAllByPosId(posId);
    return { count };
  }

  async geyAllByPermission(
    ability: any,
    placementId?: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]> {
    return await this.warehouseRepository.findAllByPermission(
      ability,
      placementId,
      skip,
      take,
    );
  }

  async getCountAllByPermission(
    ability: any,
    placementId?: number,
  ): Promise<{ count: number }> {
    const count = await this.warehouseRepository.findCountAllByPermission(
      ability,
      placementId,
    );
    return { count };
  }

  async getAllByOrganizationId(
    organizationId: number,
    ability: any,
    posId?: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]> {
    return await this.warehouseRepository.findAllByOrganizationId(
      organizationId,
      ability,
      posId,
      skip,
      take,
    );
  }

  async getCountAllByOrganizationId(
    organizationId: number,
    ability: any,
    posId?: number,
  ): Promise<{ count: number }> {
    const count = await this.warehouseRepository.findCountAllByOrganizationId(
      organizationId,
      ability,
      posId,
    );
    return { count };
  }
}
