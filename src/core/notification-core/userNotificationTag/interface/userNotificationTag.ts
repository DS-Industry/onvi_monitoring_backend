import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';

export abstract class IUserNotificationTagRepository {
  abstract create(input: UserNotificationTag): Promise<UserNotificationTag>;
  abstract createMany(input: UserNotificationTag[]): Promise<void>;
  abstract findAll(): Promise<UserNotificationTag[]>;
  abstract findAllByFilter(
    authorUserId?: number,
    userNotificationId?: number,
    name?: string,
  ): Promise<UserNotificationTag[]>;
  abstract findOneById(id: number): Promise<UserNotificationTag>;
  abstract update(input: UserNotificationTag): Promise<UserNotificationTag>;
  abstract delete(input: UserNotificationTag): Promise<any>;
}
