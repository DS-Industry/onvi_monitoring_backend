import { TechConsumables } from "@tech-report/techConsumables/domain/techConsumables";
import { TechConsumablesType } from "@prisma/client";

export abstract class ITechConsumablesRepository {
  abstract create(input: TechConsumables): Promise<TechConsumables>;
  abstract findOneById(id: number): Promise<TechConsumables>;
  abstract findAllByFilter(
    nomenclatureId?: number,
    posId?: number,
    type?: TechConsumablesType,
    skip?: number,
    take?: number,
  ): Promise<TechConsumables[]>;
  abstract countAllByFilter(
    nomenclatureId?: number,
    posId?: number,
    type?: TechConsumablesType
  ): Promise<number>;
  abstract update(input: TechConsumables): Promise<TechConsumables>;
  abstract delete(id: number): Promise<void>;
}