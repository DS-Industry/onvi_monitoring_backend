import { Injectable } from '@nestjs/common';
import { IUserNotificationRepository } from '@notification/userNotification/interface/userNotification';
import { PrismaService } from '@db/prisma/prisma.service';
import { UserNotification } from '@notification/userNotification/domain/userNotification';
import { PrismaUserNotificationMapper } from '@db/mapper/prisma-user-notification-mapper';
import { UserNotificationType } from '@prisma/client';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';

@Injectable()
export class UserNotificationRepository extends IUserNotificationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: UserNotification): Promise<UserNotification> {
    const userNotificationPrismaEntity =
      PrismaUserNotificationMapper.toPrisma(input);
    const userNotification = await this.prisma.userNotification.create({
      data: userNotificationPrismaEntity,
    });
    return PrismaUserNotificationMapper.toDomain(userNotification);
  }

  public async createMany(input: UserNotification[]): Promise<void> {
    const userNotificationEntities = input.map((item) =>
      PrismaUserNotificationMapper.toPrisma(item),
    );

    await this.prisma.userNotification.createMany({
      data: userNotificationEntities,
    });
  }

  public async findOneById(id: number): Promise<UserNotification> {
    const userNotification = await this.prisma.userNotification.findFirst({
      where: {
        id,
      },
    });
    return PrismaUserNotificationMapper.toDomain(userNotification);
  }

  public async findOneFullById(
    id: number,
  ): Promise<FullDataUserNotificationDto> {
    const userNotification = await this.prisma.userNotification.findFirst({
      where: {
        id,
      },
      include: {
        notification: true,
        tags: true,
      },
    });
    return PrismaUserNotificationMapper.toFullDomain(userNotification);
  }

  public async update(input: UserNotification): Promise<UserNotification> {
    const userNotificationPrismaEntity =
      PrismaUserNotificationMapper.toPrisma(input);
    const userNotification = await this.prisma.userNotification.update({
      where: {
        id: input.id,
      },
      data: userNotificationPrismaEntity,
    });
    return PrismaUserNotificationMapper.toDomain(userNotification);
  }

  public async findAllByFilter(
    notificationId?: number,
    userId?: number,
    type?: UserNotificationType,
    tagId?: number,
    skip?: number,
    take?: number,
  ): Promise<UserNotification[]> {
    const where: any = {};

    if (notificationId !== undefined) {
      where.notificationId = notificationId;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (tagId !== undefined) {
      where.tags = { some: { id: tagId } };
    }

    const userNotifications = await this.prisma.userNotification.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        sendAt: 'desc',
      },
    });
    return userNotifications.map((item) =>
      PrismaUserNotificationMapper.toDomain(item),
    );
  }

  public async findAllFullByFilter(
    userId?: number,
    type?: UserNotificationType,
    tagId?: number,
    readStatus?: ReadStatus,
    skip?: number,
    take?: number,
  ): Promise<FullDataUserNotificationDto[]> {
    const where: any = {};

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (tagId !== undefined) {
      where.tags = { some: { id: tagId } };
    }

    if (readStatus !== undefined) {
      where.openingAt = readStatus === ReadStatus.READ ? { not: null } : null;
    }

    const userNotifications = await this.prisma.userNotification.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      include: {
        notification: true,
        tags: true,
      },
      orderBy: {
        sendAt: 'desc',
      },
    });
    return userNotifications.map((item) =>
      PrismaUserNotificationMapper.toFullDomain(item),
    );
  }

  public async updateConnectionTag(
    userNotificationId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any> {
    await this.prisma.userNotification.update({
      where: {
        id: userNotificationId,
      },
      data: {
        tags: {
          disconnect: deleteTagIds.map((id) => ({ id })),
          connect: addTagIds.map((id) => ({ id })),
        },
      },
    });
  }

  public async updateReadAll(userId: number, readDate: Date): Promise<any> {
    await this.prisma.userNotification.updateMany({
      where: {
        userId: userId,
        openingAt: null,
      },
      data: {
        openingAt: readDate,
      },
    });
  }
}
