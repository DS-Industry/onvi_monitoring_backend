import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { DestinyNomenclature, NomenclatureStatus } from "@prisma/client";

export abstract class INomenclatureRepository {
  abstract create(input: Nomenclature): Promise<Nomenclature>;
  abstract createMany(input: Nomenclature[]): Promise<void>;
  abstract findOneById(id: number): Promise<Nomenclature>;
  abstract findOneBySkuAndOrganizationId(
    sku: string,
    organizationId: number,
  ): Promise<Nomenclature>;
  abstract findOneByNameAndOrganizationId(
    name: string,
    organizationId: number,
  ): Promise<Nomenclature>;
  abstract findAllByFilter(
    organizationId?: number,
    categoryId?: number,
    destiny?: DestinyNomenclature,
    status?: NomenclatureStatus,
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<Nomenclature[]>;
  abstract findAllByFilterCount(
    organizationId?: number,
    categoryId?: number,
    destiny?: DestinyNomenclature,
    status?: NomenclatureStatus,
    search?: string,
  ): Promise<number>;
  abstract findManyByIds(ids: number[]): Promise<Nomenclature[]>;
  abstract update(input: Nomenclature): Promise<Nomenclature>;
}
