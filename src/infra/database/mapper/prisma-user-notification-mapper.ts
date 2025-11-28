import {
  UserNotification as PrismaUserNotification,
  Prisma,
} from '@prisma/client';
import { UserNotification } from '@notification/userNotification/domain/userNotification';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
type PrismaUserNotificationWithRelations = Prisma.UserNotificationGetPayload<{
  include: {
    notification: true;
    tags: true;
  };
}>;
export class PrismaUserNotificationMapper {
  static toDomain(entity: PrismaUserNotification): UserNotification {
    if (!entity) {
      return null;
    }
    return new UserNotification({
      id: entity.id,
      notificationId: entity.notificationId,
      userId: entity.userId,
      sendAt: entity.sendAt,
      openingAt: entity.openingAt,
      type: entity.type,
    });
  }

  static toFullDomain(
    entity: PrismaUserNotificationWithRelations,
  ): FullDataUserNotificationDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      notificationId: entity.notificationId,
      heading: entity.notification.heading,
      body: entity.notification.body,
      authorId: entity.notification.authorId,
      sendAt: entity.sendAt,
      openingAt: entity.openingAt,
      type: entity.type,
      tags: entity.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
    };
  }

  static toPrisma(
    userNotification: UserNotification,
  ): Prisma.UserNotificationUncheckedCreateInput {
    return {
      id: userNotification?.id,
      notificationId: userNotification.notificationId,
      userId: userNotification.userId,
      sendAt: userNotification.sendAt,
      openingAt: userNotification?.openingAt,
      type: userNotification?.type,
    };
  }
}
