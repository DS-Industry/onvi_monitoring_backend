import { Injectable } from '@nestjs/common';
import { IManagerPaperRepository } from '@manager-paper/managerPaper/interface/managerPaper';
import { PrismaService } from '@db/prisma/prisma.service';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { PrismaManagerPaperMapper } from '@db/mapper/prisma-manager-paper-mapper';
import { ManagerPaperGroup } from '@prisma/client';
import { accessibleBy } from '@casl/prisma';
import { ManagerPaperWithTypeDto } from '@manager-paper/managerPaper/use-case/dto/managerPaperWithType.dto';

@Injectable()
export class ManagerPaperRepository extends IManagerPaperRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ManagerPaper): Promise<ManagerPaper> {
    const managerPaperPrismaEntity = PrismaManagerPaperMapper.toPrisma(input);
    const managerPaper = await this.prisma.managerPaper.create({
      data: managerPaperPrismaEntity,
    });
    return PrismaManagerPaperMapper.toDomain(managerPaper);
  }

  public async findOneById(id: number): Promise<ManagerPaper> {
    const managerPaper = await this.prisma.managerPaper.findFirst({
      where: {
        id,
      },
    });
    return PrismaManagerPaperMapper.toDomain(managerPaper);
  }

  public async findAllByFilter(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
    skip?: number,
    take?: number,
  ): Promise<ManagerPaper[]> {
    const where: any = {};

    if (group !== undefined) {
      where.group = group;
    }

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (paperTypeId !== undefined) {
      where.paperTypeId = paperTypeId;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (dateStartEvent !== undefined && dateEndEvent !== undefined) {
      where.eventDate = {
        gte: dateStartEvent,
        lte: dateEndEvent,
      };
    }

    const finalWhere = ability
      ? { AND: [accessibleBy(ability).ManagerPaper, where] }
      : where;

    const managerPapers = await this.prisma.managerPaper.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: finalWhere,
      orderBy: {
        eventDate: 'asc',
      },
    });
    return managerPapers.map((item) => PrismaManagerPaperMapper.toDomain(item));
  }

  public async findAllByFilterWithType(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
    skip?: number,
    take?: number,
  ): Promise<ManagerPaperWithTypeDto[]> {
    const where: any = {};

    if (group !== undefined) {
      where.group = group;
    }

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (paperTypeId !== undefined) {
      where.paperTypeId = paperTypeId;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (dateStartEvent !== undefined && dateEndEvent !== undefined) {
      where.eventDate = {
        gte: dateStartEvent,
        lte: dateEndEvent,
      };
    }

    const finalWhere = ability
      ? { AND: [accessibleBy(ability).ManagerPaper, where] }
      : where;

    const managerPapers = await this.prisma.managerPaper.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: finalWhere,
      orderBy: {
        eventDate: 'asc',
      },
      include: { paperType: true },
    });
    return managerPapers.map((item) =>
      PrismaManagerPaperMapper.toDomainWithType(item),
    );
  }

  public async countAllByFilter(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
  ): Promise<number> {
    const where: any = {};

    if (group !== undefined) {
      where.group = group;
    }

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (paperTypeId !== undefined) {
      where.paperTypeId = paperTypeId;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (dateStartEvent !== undefined && dateEndEvent !== undefined) {
      where.eventDate = {
        gte: dateStartEvent,
        lte: dateEndEvent,
      };
    }

    const finalWhere = ability
      ? { AND: [accessibleBy(ability).ManagerPaper, where] }
      : where;

    return this.prisma.managerPaper.count({
      where: finalWhere,
    });
  }

  public async update(input: ManagerPaper): Promise<ManagerPaper> {
    const managerPaperPrismaEntity = PrismaManagerPaperMapper.toPrisma(input);
    const managerPaper = await this.prisma.managerPaper.update({
      where: {
        id: input.id,
      },
      data: managerPaperPrismaEntity,
    });
    return PrismaManagerPaperMapper.toDomain(managerPaper);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.managerPaper.delete({ where: { id } });
  }

  public async deleteByCashCollection(cashCollectionId: number): Promise<void> {
    await this.prisma.managerPaper.deleteMany({ where: { cashCollectionId } });
  }
}
