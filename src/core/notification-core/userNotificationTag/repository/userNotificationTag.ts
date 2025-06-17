import { Injectable } from '@nestjs/common';
import { IUserNotificationTagRepository } from '@notification/userNotificationTag/interface/userNotificationTag';
import { PrismaService } from '@db/prisma/prisma.service';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';
import { PrismaUserNotificationTagMapper } from '@db/mapper/prisma-user-notification-tag-mapper';

@Injectable()
export class UserNotificationTagRepository extends IUserNotificationTagRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: UserNotificationTag,
  ): Promise<UserNotificationTag> {
    const userNotificationTagEntity =
      PrismaUserNotificationTagMapper.toPrisma(input);
    const userNotificationTag = await this.prisma.userNotificationTag.create({
      data: userNotificationTagEntity,
    });
    return PrismaUserNotificationTagMapper.toDomain(userNotificationTag);
  }

  public async createMany(input: UserNotificationTag[]): Promise<void> {
    const userNotificationTagEntities = input.map((item) =>
      PrismaUserNotificationTagMapper.toPrisma(item),
    );
    await this.prisma.userNotificationTag.createMany({
      data: userNotificationTagEntities,
    });
  }

  public async findAll(): Promise<UserNotificationTag[]> {
    const userNotificationTags =
      await this.prisma.userNotificationTag.findMany();
    return userNotificationTags.map((item) =>
      PrismaUserNotificationTagMapper.toDomain(item),
    );
  }

  public async findAllByFilter(
    authorUserId?: number,
    userNotificationId?: number,
    name?: string,
  ): Promise<UserNotificationTag[]> {
    const where: any = {};

    if (authorUserId !== undefined) {
      where.authorUserId = authorUserId;
    }

    if (userNotificationId !== undefined) {
      where.userNotifications = { some: { id: userNotificationId } };
    }

    if (name !== undefined) {
      where.name = name;
    }

    const userNotificationTags = await this.prisma.userNotificationTag.findMany(
      { where },
    );
    return userNotificationTags.map((item) =>
      PrismaUserNotificationTagMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<UserNotificationTag> {
    const userNotificationTag = await this.prisma.userNotificationTag.findFirst(
      {
        where: {
          id,
        },
      },
    );
    return PrismaUserNotificationTagMapper.toDomain(userNotificationTag);
  }

  public async update(
    input: UserNotificationTag,
  ): Promise<UserNotificationTag> {
    const userNotificationTagEntity =
      PrismaUserNotificationTagMapper.toPrisma(input);
    const userNotificationTag = await this.prisma.userNotificationTag.update({
      where: { id: input.id },
      data: userNotificationTagEntity,
    });
    return PrismaUserNotificationTagMapper.toDomain(userNotificationTag);
  }

  public async delete(input: UserNotificationTag): Promise<any> {
    const userNotificationWithTag = await this.prisma.userNotification.findMany(
      {
        where: { tags: { some: { id: input.id } } },
      },
    );

    for (const userNotification of userNotificationWithTag) {
      await this.prisma.userNotification.update({
        where: { id: userNotification.id },
        data: { tags: { disconnect: { id: input.id } } },
      });
    }

    await this.prisma.userNotificationTag.delete({ where: { id: input.id } });
  }
}
