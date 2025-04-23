import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

export abstract class IWarehouseRepository {
  abstract create(input: Warehouse): Promise<Warehouse>;
  abstract findOneById(id: number): Promise<Warehouse>;
  abstract findAllByPosId(posId: number): Promise<Warehouse[]>;
  abstract findAllByPermission(
    ability: any,
    placementId: number | '*',
  ): Promise<Warehouse[]>;
  abstract update(input: Warehouse): Promise<Warehouse>;
}
