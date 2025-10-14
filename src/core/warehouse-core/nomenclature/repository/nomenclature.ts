import { Injectable } from '@nestjs/common';
import { INomenclatureRepository } from '@warehouse/nomenclature/interface/nomenclature';
import { PrismaService } from '@db/prisma/prisma.service';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { PrismaNomenclatureMapper } from '@db/mapper/prisma-nomenclature-mapper';
import { DestinyNomenclature, NomenclatureStatus } from '@prisma/client';

@Injectable()
export class NomenclatureRepository extends INomenclatureRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Nomenclature): Promise<Nomenclature> {
    const nomenclatureEntity = PrismaNomenclatureMapper.toPrisma(input);
    const nomenclature = await this.prisma.nomenclature.create({
      data: nomenclatureEntity,
    });
    return PrismaNomenclatureMapper.toDomain(nomenclature);
  }

  public async createMany(input: Nomenclature[]): Promise<void> {
    const nomenclatureEntities = input.map((item) =>
      PrismaNomenclatureMapper.toPrisma(item),
    );
    await this.prisma.nomenclature.createMany({
      data: nomenclatureEntities,
    });
  }

  public async findOneById(id: number): Promise<Nomenclature> {
    const nomenclature = await this.prisma.nomenclature.findFirst({
      where: {
        id,
      },
    });
    return PrismaNomenclatureMapper.toDomain(nomenclature);
  }

  public async findOneBySkuAndOrganizationId(
    sku: string,
    organizationId: number,
  ): Promise<Nomenclature> {
    const nomenclature = await this.prisma.nomenclature.findFirst({
      where: {
        sku,
        organizationId,
        status: NomenclatureStatus.ACTIVE,
      },
    });
    return PrismaNomenclatureMapper.toDomain(nomenclature);
  }

  public async findOneByNameAndOrganizationId(
    name: string,
    organizationId: number,
  ): Promise<Nomenclature> {
    const nomenclature = await this.prisma.nomenclature.findFirst({
      where: {
        name,
        organizationId,
        status: NomenclatureStatus.ACTIVE,
      },
    });
    return PrismaNomenclatureMapper.toDomain(nomenclature);
  }

  public async findAllByFilter(
    organizationId?: number,
    categoryId?: number,
    destiny?: DestinyNomenclature,
    status?: NomenclatureStatus,
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<Nomenclature[]> {
    const where: any = {};

    if (organizationId !== undefined) {
      where.organizationId = organizationId;
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (destiny !== undefined) {
      where.destiny = destiny;
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (search !== undefined && search.trim() !== '') {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const nomenclatures = await this.prisma.nomenclature.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        sku: 'asc',
      },
    });
    return nomenclatures.map((item) => PrismaNomenclatureMapper.toDomain(item));
  }

  public async findAllByFilterCount(
    organizationId?: number,
    categoryId?: number,
    destiny?: DestinyNomenclature,
    status?: NomenclatureStatus,
    search?: string,
  ): Promise<number> {
    const where: any = {};

    if (organizationId !== undefined) {
      where.organizationId = organizationId;
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (destiny !== undefined) {
      where.destiny = destiny;
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (search !== undefined && search.trim() !== '') {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.nomenclature.count({
      where: where,
    });
  }

  public async findManyByIds(ids: number[]): Promise<Nomenclature[]> {
    const nomenclatures = await this.prisma.nomenclature.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return nomenclatures.map((item) => PrismaNomenclatureMapper.toDomain(item));
  }

  public async update(input: Nomenclature): Promise<Nomenclature> {
    const nomenclatureEntity = PrismaNomenclatureMapper.toPrisma(input);
    const nomenclature = await this.prisma.nomenclature.update({
      where: {
        id: input.id,
      },
      data: nomenclatureEntity,
    });
    return PrismaNomenclatureMapper.toDomain(nomenclature);
  }
}
