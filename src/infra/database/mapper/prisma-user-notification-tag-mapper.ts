import {
  UserNotificationTag as PrismaUserNotificationTag,
  Prisma,
} from '@prisma/client';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';

export class PrismaUserNotificationTagMapper {
  static toDomain(entity: PrismaUserNotificationTag): UserNotificationTag {
    if (!entity) {
      return null;
    }
    return new UserNotificationTag({
      id: entity.id,
      name: entity.name,
      color: entity.color,
      authorUserId: entity.authorUserId,
    });
  }

  static toPrisma(
    userNotificationTag: UserNotificationTag,
  ): Prisma.UserNotificationTagUncheckedCreateInput {
    return {
      id: userNotificationTag?.id,
      name: userNotificationTag.name,
      color: userNotificationTag.color,
      authorUserId: userNotificationTag.authorUserId,
    };
  }
}
