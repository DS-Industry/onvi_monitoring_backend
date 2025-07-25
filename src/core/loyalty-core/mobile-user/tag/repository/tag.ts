import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';
import { PrismaUserTagMapper } from '@db/mapper/prisma-user-tag-mapper';
import { ITagRepository } from '@loyalty/mobile-user/tag/interface/tag';

@Injectable()
export class TagRepository extends ITagRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Tag): Promise<Tag> {
    const tagEntity = PrismaUserTagMapper.toPrisma(input);
    const tag = await this.prisma.lTYUserTag.create({
      data: tagEntity,
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async createMany(input: Tag[]): Promise<void> {
    const tagEntities = input.map((item) => PrismaUserTagMapper.toPrisma(item));
    await this.prisma.lTYUserTag.createMany({
      data: tagEntities,
    });
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.lTYUserTag.findMany();
    return tags.map((item) => PrismaUserTagMapper.toDomain(item));
  }

  public async findAllByClientId(clientId: number): Promise<Tag[]> {
    const tags = await this.prisma.lTYUserTag.findMany({
      where: { clients: { some: { id: clientId } } },
    });
    return tags.map((item) => PrismaUserTagMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Tag> {
    const tag = await this.prisma.lTYUserTag.findFirst({
      where: {
        id,
      },
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async findOneByName(name: string): Promise<Tag> {
    const tag = await this.prisma.lTYUserTag.findFirst({
      where: {
        name,
      },
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async delete(input: Tag): Promise<any> {
    const usersWithTag = await this.prisma.lTYUser.findMany({
      where: { tags: { some: { id: input.id } } },
    });

    for (const user of usersWithTag) {
      await this.prisma.lTYUser.update({
        where: { id: user.id },
        data: { tags: { disconnect: { id: input.id } } },
      });
    }

    await this.prisma.lTYUserTag.delete({ where: { id: input.id } });
  }
}
