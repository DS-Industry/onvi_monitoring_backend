import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { PrismaService } from '@db/prisma/prisma.service';
import { Position } from '@hr/position/domain/position';
import { PrismaHrPositionMapper } from '@db/mapper/prisma-hr-position-mapper';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PositionRepository extends IPositionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Position): Promise<Position> {
    const positionPrismaEntity = PrismaHrPositionMapper.toPrisma(input);
    const position = await this.prisma.hrPosition.create({
      data: positionPrismaEntity,
    });
    return PrismaHrPositionMapper.toDomain(position);
  }

  public async findOneById(id: number): Promise<Position> {
    const position = await this.prisma.hrPosition.findFirst({
      where: {
        id,
      },
    });
    return PrismaHrPositionMapper.toDomain(position);
  }

  public async findAll(): Promise<Position[]> {
    const positions = await this.prisma.hrPosition.findMany();
    return positions.map((item) => PrismaHrPositionMapper.toDomain(item));
  }

  public async findAllByAbility(ability: any): Promise<Position[]> {
    const positions = await this.prisma.hrPosition.findMany({
      where: {
        organization: accessibleBy(ability).Organization,
      },
    });
    return positions.map((item) => PrismaHrPositionMapper.toDomain(item));
  }

  public async findAllByOrgId(orgId: number): Promise<Position[]> {
    const positions = await this.prisma.hrPosition.findMany({
      where: {
        organizationId: orgId,
      },
    });
    return positions.map((item) => PrismaHrPositionMapper.toDomain(item));
  }

  public async update(input: Position): Promise<Position> {
    const positionPrismaEntity = PrismaHrPositionMapper.toPrisma(input);
    const position = await this.prisma.hrPosition.update({
      where: {
        id: input.id,
      },
      data: positionPrismaEntity,
    });
    return PrismaHrPositionMapper.toDomain(position);
  }
}
