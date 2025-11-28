import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '@notification/notification/interface/notification';
import { PrismaService } from '@db/prisma/prisma.service';
import { Notification } from '@notification/notification/domain/notification';
import { PrismaNotificationMapper } from '@db/mapper/prisma-notification-mapper';

@Injectable()
export class NotificationRepository extends INotificationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Notification): Promise<Notification> {
    const notificationPrismaEntity = PrismaNotificationMapper.toPrisma(input);
    const notification = await this.prisma.notification.create({
      data: notificationPrismaEntity,
    });
    return PrismaNotificationMapper.toDomain(notification);
  }

  public async findOneById(id: number): Promise<Notification> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
      },
    });
    return PrismaNotificationMapper.toDomain(notification);
  }

  public async findAllByFilter(
    authorId?: number,
    skip?: number,
    take?: number,
  ): Promise<Notification[]> {
    const where: any = {};

    if (authorId !== undefined) {
      where.authorId = authorId;
    }

    const notifications = await this.prisma.notification.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        id: 'desc',
      },
    });
    return notifications.map((item) => PrismaNotificationMapper.toDomain(item));
  }

  public async update(input: Notification): Promise<Notification> {
    const notificationPrismaEntity = PrismaNotificationMapper.toPrisma(input);
    const notification = await this.prisma.notification.update({
      where: {
        id: input.id,
      },
      data: notificationPrismaEntity,
    });
    return PrismaNotificationMapper.toDomain(notification);
  }
}
