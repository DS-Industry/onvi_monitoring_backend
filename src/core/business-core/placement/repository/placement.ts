import { Injectable } from '@nestjs/common';
import { IPlacementRepository } from '@business-core/placement/interface/placement';
import { PrismaService } from '@db/prisma/prisma.service';
import { Placement } from '@business-core/placement/domain/placement';
import { PrismaPlacementMapper } from '@db/mapper/prisma-placement-mapper';

@Injectable()
export class PlacementRepository extends IPlacementRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Placement): Promise<Placement> {
    const placementPrismaEntity = PrismaPlacementMapper.toPrisma(input);
    const placement = await this.prisma.placement.create({
      data: placementPrismaEntity,
    });
    return PrismaPlacementMapper.toDomain(placement);
  }

  public async findOneById(id: number): Promise<Placement> {
    const placement = await this.prisma.placement.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlacementMapper.toDomain(placement);
  }

  public async findAll(): Promise<Placement[]> {
    const placements = await this.prisma.placement.findMany();
    return placements.map((item) => PrismaPlacementMapper.toDomain(item));
  }
}
