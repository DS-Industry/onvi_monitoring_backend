import { Injectable } from "@nestjs/common";
import { ITechConsumablesRepository } from "@tech-report/techConsumables/interface/techConsumables";
import { PrismaService } from "@db/prisma/prisma.service";
import { TechConsumables } from "@tech-report/techConsumables/domain/techConsumables";
import { PrismaTechConsumablesMapper } from "@db/mapper/prisma-tech-consumables-mapper";
import { TechConsumablesType } from "@prisma/client";

@Injectable()
export class TechConsumablesRepository extends ITechConsumablesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: TechConsumables): Promise<TechConsumables> {
    const techConsumablesEntity = PrismaTechConsumablesMapper.toPrisma(input);
    const techConsumables = await this.prisma.techConsumables.create({
      data: techConsumablesEntity
    })
    return PrismaTechConsumablesMapper.toDomain(techConsumables);
  }

  public async findOneById(id: number): Promise<TechConsumables> {
    const techConsumables = await this.prisma.techConsumables.findFirst({
      where: {
        id
      }
    });
    return PrismaTechConsumablesMapper.toDomain(techConsumables);
  }

  public async findAllByFilter(
    nomenclatureId?: number,
    posId?: number,
    type?: TechConsumablesType,
    skip?: number,
    take?: number,
  ): Promise<TechConsumables[]> {
    const where: any = {};

    if (nomenclatureId !== undefined) {
      where.nomenclatureId = nomenclatureId;
    }

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (type !== undefined) {
      where.type = type;
    }

    const techConsumables = await this.prisma.techConsumables.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
    })

    return techConsumables.map((item) => PrismaTechConsumablesMapper.toDomain(item));
  }

  public async countAllByFilter(
    nomenclatureId?: number,
    posId?: number,
    type?: TechConsumablesType,
  ): Promise<number> {
    const where: any = {};

    if (nomenclatureId !== undefined) {
      where.nomenclatureId = nomenclatureId;
    }

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (type !== undefined) {
      where.type = type;
    }

    return this.prisma.techConsumables.count({
      where: where,
    })
  }

  public async update(input: TechConsumables): Promise<TechConsumables> {
    const techConsumablesEntity = PrismaTechConsumablesMapper.toPrisma(input);
    const techConsumables = await this.prisma.techConsumables.update({
      where: {
        id: input.id,
      },
      data: techConsumablesEntity
    })
    return PrismaTechConsumablesMapper.toDomain(techConsumables);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.techConsumables.delete({
      where: {
        id: id,
      },
    });
  }
}