import { Notification as PrismaNotification, Prisma } from '@prisma/client';
import { Notification } from '@notification/notification/domain/notification';

export class PrismaNotificationMapper {
  static toDomain(entity: PrismaNotification): Notification {
    if (!entity) {
      return null;
    }
    return new Notification({
      id: entity.id,
      heading: entity.heading,
      body: entity.body,
      scheduledSendAt: entity.scheduledSendAt,
      authorId: entity.authorId,
    });
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification?.id,
      heading: notification.heading,
      body: notification.body,
      scheduledSendAt: notification?.scheduledSendAt,
      authorId: notification?.authorId,
    };
  }
}
