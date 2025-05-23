import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PrismaService } from '@db/prisma/prisma.service';
import { Pos } from '@pos/pos/domain/pos';
import { PrismaPosMapper } from '@db/mapper/prisma-pos-mapper';
import { accessibleBy } from '@casl/prisma';

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

  public async findAll(): Promise<Pos[]> {
    const pos = await this.prisma.pos.findMany();
    return pos.map((item) => PrismaPosMapper.toDomain(item));
  }

  public async findAllByOrgId(orgId: number): Promise<Pos[]> {
    const pos = await this.prisma.pos.findMany({
      where: { organizationId: orgId },
    });
    return pos.map((item) => PrismaPosMapper.toDomain(item));
  }

  public async findAllByUserId(userId: number): Promise<Pos[]> {
    const pos = await this.prisma.pos.findMany({
      where: { usersPermissions: { some: { id: userId } } },
    });
    return pos.map((item) => PrismaPosMapper.toDomain(item));
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

  public async findOneBySlug(slug: string): Promise<Pos> {
    const pos = await this.prisma.pos.findFirst({
      where: {
        slug,
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

  public async findAllByPermission(
    ability: any,
    placementId?: number | '*',
  ): Promise<Pos[]> {
    const pos = await this.prisma.pos.findMany({
      where: {
        AND: [
          accessibleBy(ability).Pos,
          placementId !== '*' ? { placementId } : {},
        ],
      },
    });
    return pos.map((item) => PrismaPosMapper.toDomain(item));
  }
}
