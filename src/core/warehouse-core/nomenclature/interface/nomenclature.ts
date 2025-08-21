import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { DestinyNomenclature } from "@prisma/client";

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
  abstract findAllByOrganizationId(
    organizationId: number,
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]>;
  abstract findAllByOrganizationIdAndDestiny(
    organizationId: number,
    destiny: DestinyNomenclature,
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]>;
  abstract countAllByOrganizationId(
    organizationId: number,
  ): Promise<number>;
  abstract findAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]>;
  abstract countAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
  ): Promise<number>;
  abstract findAllBySupplierIdAndOrganizationId(
    supplierId: number,
    organizationId: number,
  ): Promise<Nomenclature[]>;
  abstract findManyByIds(ids: number[]): Promise<Nomenclature[]>;
  abstract update(input: Nomenclature): Promise<Nomenclature>;
}
