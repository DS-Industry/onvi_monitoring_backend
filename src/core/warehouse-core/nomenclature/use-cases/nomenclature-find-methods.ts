import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { DestinyNomenclature } from '@prisma/client';

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
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByOrganizationId(
      organizationId,
      skip,
      take,
    );
  }

  async getAllByOrganizationIdAndDestiny(
    organizationId: number,
    destiny: DestinyNomenclature,
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByOrganizationIdAndDestiny(
      organizationId,
      destiny,
      skip,
      take,
    );
  }

  async getCountAllByOrganizationId(
    organizationId: number,
  ): Promise<{ count: number }> {
    const count =
      await this.nomenclatureRepository.countAllByOrganizationId(
        organizationId,
      );
    return { count };
  }

  async getAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
    skip?: number,
    take?: number,
  ): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findAllByCategoryIdAndOrganizationId(
      categoryId,
      organizationId,
      skip,
      take,
    );
  }

  async getCountAllByCategoryIdAndOrganizationId(
    categoryId: number,
    organizationId: number,
  ): Promise<{ count: number }> {
    const count =
      await this.nomenclatureRepository.countAllByCategoryIdAndOrganizationId(
        categoryId,
        organizationId,
      );
    return { count };
  }

  async getManyByIds(ids: number[]): Promise<Nomenclature[]> {
    return await this.nomenclatureRepository.findManyByIds(ids);
  }
}
