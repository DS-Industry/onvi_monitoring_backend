import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PrismaService } from '@db/prisma/prisma.service';
import { Pos } from '@pos/pos/domain/pos';
import { PrismaPosMapper } from '@db/mapper/prisma-pos-mapper';
import { accessibleBy } from '@casl/prisma';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';

@Injectable()
export class PosRepository extends IPosRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Pos): Promise<Pos> {
    const posPrismaEntity = PrismaPosMapper.toPrisma(input);
    const pos = await this.prisma.pos.create({
      data: {
        ...posPrismaEntity,
        usersPermissions: { connect: { id: posPrismaEntity.createdById } },
      },
    });
    return PrismaPosMapper.toDomain(pos);
  }

  public async findOneById(id: number): Promise<Pos> {
    const pos = await this.prisma.pos.findFirst({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
    return PrismaPosMapper.toDomain(pos);
  }

  public async findOneByName(name: string): Promise<Pos> {
    const pos = await this.prisma.pos.findFirst({
      where: {
        name,
      },
    });
    return PrismaPosMapper.toDomain(pos);
  }

  public async update(input: Pos): Promise<Pos> {
    const posPrismaEntity = PrismaPosMapper.toPrisma(input);
    const pos = await this.prisma.pos.update({
      where: {
        id: input.id,
      },
      data: posPrismaEntity,
    });
    return PrismaPosMapper.toDomain(pos);
  }

  public async findAllByFilter(
    ability?: any,
    placementId?: number,
    organizationId?: number,
    userId?: number,
    skip?: number,
    take?: number,
  ): Promise<PosResponseDto[]> {
    const where: any = {};

    if (placementId !== undefined) {
      where.placementId = placementId;
    }

    if (organizationId !== undefined) {
      where.organizationId = organizationId;
    }

    if (userId !== undefined) {
      where.usersPermissions = { some: { id: userId } };
    }

    const finalWhere = ability
      ? {
          AND: [accessibleBy(ability).Pos, where],
        }
      : where;

    const pos = await this.prisma.pos.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        AND: finalWhere,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        carWashPos: true,
        address: true,
      },
    });
    return pos.map((item) => PrismaPosMapper.toDomainFullData(item));
  }

  public async countAllByAbilityAndPlacement(
    ability: any,
    placementId?: number | '*',
  ): Promise<number> {
    return this.prisma.pos.count({
      where: {
        AND: [
          accessibleBy(ability).Pos,
          placementId !== '*' ? { placementId } : {},
        ],
      },
    });
  }

  public async updateConnectionWorker(
    posId: number,
    addWorkerIds: number[],
    deleteWorkerIds: number[],
  ): Promise<any> {
    await this.prisma.pos.update({
      where: {
        id: posId,
      },
      data: {
        workers: {
          disconnect: deleteWorkerIds.map((id) => ({ id })),
          connect: addWorkerIds.map((id) => ({ id })),
        },
      },
    });
  }
}
