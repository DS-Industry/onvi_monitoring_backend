import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { DestinyNomenclature, NomenclatureStatus } from '@prisma/client';

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

  async getAllByFilter(data: {
    organizationId?: number;
    categoryId?: number;
    destiny?: DestinyNomenclature;
    status?: NomenclatureStatus;
    skip?: number;
    take?: number;
  }): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByFilter(
      data.organizationId,
      data.categoryId,
      data.destiny,
      data.status,
      data.skip,
      data.take,
    );
  }

  async getCountAllByFilter(data: {
    organizationId?: number;
    categoryId?: number;
    destiny?: DestinyNomenclature;
    status?: NomenclatureStatus;
  }): Promise<number> {
    return await this.nomenclatureRepository.findAllByFilterCount(
      data.organizationId,
      data.categoryId,
      data.destiny,
      data.status,
    );
  }

  async getManyByIds(ids: number[]): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findManyByIds(ids);
  }
}
