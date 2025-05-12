import { Injectable } from '@nestjs/common';
import { ITechTagRepository } from '@tech-task/tag/interface/techTag';
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTag } from '@tech-task/tag/domain/techTag';
import { PrismaTechTagMapper } from '@db/mapper/prisma-tech-tag-mapper';

@Injectable()
export class TechTagRepository extends ITechTagRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: TechTag): Promise<TechTag> {
    const techTagEntity = PrismaTechTagMapper.toPrisma(input);
    const techTag = await this.prisma.techTaskTag.create({
      data: techTagEntity,
    });
    return PrismaTechTagMapper.toDomain(techTag);
  }

  public async createMany(input: TechTag[]): Promise<void> {
    const techTagEntities = input.map((item) =>
      PrismaTechTagMapper.toPrisma(item),
    );
    await this.prisma.techTaskTag.createMany({
      data: techTagEntities,
    });
  }

  public async findAll(): Promise<TechTag[]> {
    const techTags = await this.prisma.techTaskTag.findMany();
    return techTags.map((item) => PrismaTechTagMapper.toDomain(item));
  }

  public async findAllByTechTaskId(techTaskId: number): Promise<TechTag[]> {
    const techTags = await this.prisma.techTaskTag.findMany({
      where: { techTasks: { some: { id: techTaskId } } },
    });
    return techTags.map((item) => PrismaTechTagMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<TechTag> {
    const techTag = await this.prisma.techTaskTag.findFirst({
      where: {
        id,
      },
    });
    return PrismaTechTagMapper.toDomain(techTag);
  }

  public async findOneByName(name: string): Promise<TechTag> {
    const techTag = await this.prisma.techTaskTag.findFirst({
      where: {
        name,
      },
    });
    return PrismaTechTagMapper.toDomain(techTag);
  }
}
