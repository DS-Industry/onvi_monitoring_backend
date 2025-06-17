import { Notification } from '@notification/notification/domain/notification';

export abstract class INotificationRepository {
  abstract create(input: Notification): Promise<Notification>;
  abstract findOneById(id: number): Promise<Notification>;
  abstract findAllByFilter(
    authorId?: number,
    skip?: number,
    take?: number,
  ): Promise<Notification[]>;
  abstract update(input: Notification): Promise<Notification>;
}
