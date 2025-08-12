import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';

@Injectable()
export class FindMethodsNomenclatureUseCase {
  constructor(
    private readonly nomenclatureRepository: INomenclatureRepository,
  ) {}

  async getOneById(id: number): Promise<Nomenclature> {
    return await this.nomenclatureRepository.findOneById(id);
  }

  async getOneBySkuAndOrganizationId(
    sku: string,
    organizationId: number,
  ): Promise<Nomenclature> {
    return await this.nomenclatureRepository.findOneBySkuAndOrganizationId(
      sku,
      organizationId,
    );
  }

  async getOneByNameAndOrganizationId(
    name: string,
    organizationId: number,
  ): Promise<Nomenclature> {
    return await this.nomenclatureRepository.findOneByNameAndOrganizationId(
      name,
      organizationId,
    );
  }

  async getAllByOrganizationId(
    organizationId: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByOrganizationId(
      organizationId,
    );
  }

  async getAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByCategoryIdAndOrganizationId(
      categoryId,
      organizationId,
    );
  }

  async getAllBySupplierIdAndOrganizationId(
    supplierId: number,
    organizationId: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllBySupplierIdAndOrganizationId(
      supplierId,
      organizationId,
    );
  }

  async getManyByIds(ids: number[]): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findManyByIds(ids);
  }
}
