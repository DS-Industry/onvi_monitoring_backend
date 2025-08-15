import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

export abstract class IWarehouseRepository {
  abstract create(input: Warehouse): Promise<Warehouse>;
  abstract findOneById(id: number): Promise<Warehouse>;
  abstract findAllByPosId(
    posId: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]>;
  abstract findCountAllByPosId(
    posId: number,
  ): Promise<number>;
  abstract findAllByPermission(
    ability: any,
    placementId?: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]>;
  abstract findCountAllByPermission(
    ability: any,
    placementId?: number,
  ): Promise<number>;
  abstract update(input: Warehouse): Promise<Warehouse>;
}
