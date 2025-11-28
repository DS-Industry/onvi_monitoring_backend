import { Injectable } from '@nestjs/common';
import { IUserNotificationRepository } from '@notification/userNotification/interface/userNotification';
import { UserNotification } from '@notification/userNotification/domain/userNotification';

@Injectable()
export class CreateUserNotificationUseCase {
  constructor(
    private readonly userNotificationRepository: IUserNotificationRepository,
  ) {}

  async executeCreateOne(): Promise<any> {}

  async executeCreateMany(
    notificationId: number,
    userIds: number[],
  ): Promise<void> {
    const sendAt = new Date();

    const userNotifications: UserNotification[] = userIds.map((userId) => {
      return new UserNotification({
        notificationId: notificationId,
        userId: userId,
        sendAt: sendAt,
      });
    });

    await this.userNotificationRepository.createMany(userNotifications);
  }
}
