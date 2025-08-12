import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';

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
  ): Promise<Nomenclature[]>;
  abstract findAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
  ): Promise<Nomenclature[]>;
  abstract findAllBySupplierIdAndOrganizationId(
    supplierId: number,
    organizationId: number,
  ): Promise<Nomenclature[]>;
  abstract findManyByIds(ids: number[]): Promise<Nomenclature[]>;
  abstract update(input: Nomenclature): Promise<Nomenclature>;
}
