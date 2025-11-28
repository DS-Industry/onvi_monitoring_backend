import { UserNotification } from '@notification/userNotification/domain/userNotification';
import { UserNotificationType } from '@prisma/client';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';

export abstract class IUserNotificationRepository {
  abstract create(input: UserNotification): Promise<UserNotification>;
  abstract createMany(input: UserNotification[]): Promise<void>;
  abstract findOneById(id: number): Promise<UserNotification>;
  abstract findOneFullById(id: number): Promise<FullDataUserNotificationDto>;
  abstract update(input: UserNotification): Promise<UserNotification>;
  abstract findAllByFilter(
    notificationId?: number,
    userId?: number,
    type?: UserNotificationType,
    tagId?: number,
    skip?: number,
    take?: number,
  ): Promise<UserNotification[]>;
  abstract findAllFullByFilter(
    userId?: number,
    type?: UserNotificationType,
    tagId?: number,
    readStatus?: ReadStatus,
    skip?: number,
    take?: number,
  ): Promise<FullDataUserNotificationDto[]>;
  abstract updateConnectionTag(
    userNotificationId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
  abstract updateReadAll(userId: number, readDate: Date): Promise<any>;
}
