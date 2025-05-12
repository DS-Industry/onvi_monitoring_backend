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
    const tag = await this.prisma.userTag.create({
      data: tagEntity,
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async createMany(input: Tag[]): Promise<void> {
    const tagEntities = input.map((item) => PrismaUserTagMapper.toPrisma(item));
    await this.prisma.userTag.createMany({
      data: tagEntities,
    });
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.userTag.findMany();
    return tags.map((item) => PrismaUserTagMapper.toDomain(item));
  }

  public async findAllByClientId(clientId: number): Promise<Tag[]> {
    const tags = await this.prisma.userTag.findMany({
      where: { clients: { some: { id: clientId } } },
    });
    return tags.map((item) => PrismaUserTagMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Tag> {
    const tag = await this.prisma.userTag.findFirst({
      where: {
        id,
      },
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async findOneByName(name: string): Promise<Tag> {
    const tag = await this.prisma.userTag.findFirst({
      where: {
        name,
      },
    });
    return PrismaUserTagMapper.toDomain(tag);
  }

  public async delete(input: Tag): Promise<any> {
    const usersWithTag = await this.prisma.mobileUser.findMany({
      where: { tags: { some: { id: input.id } } },
    });

    for (const user of usersWithTag) {
      await this.prisma.mobileUser.update({
        where: { id: user.id },
        data: { tags: { disconnect: { id: input.id } } },
      });
    }

    await this.prisma.userTag.delete({ where: { id: input.id } });
  }
}
