import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '@notification/notification/interface/notification';
import { CreateUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-create';
import { CreateDto } from '@notification/notification/use-case/dto/create.dto';
import { Notification } from '@notification/notification/domain/notification';
import { IFirebaseAdapter } from '@libs/firebase/adapter';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly createUserNotificationUseCase: CreateUserNotificationUseCase,
    private readonly firebaseAdapter: IFirebaseAdapter,
  ) {}

  async execute(input: CreateDto): Promise<Notification> {
    const notificationData = new Notification({
      heading: input.heading,
      body: input.body,
      authorId: input?.authorId,
    });
    const notification =
      await this.notificationRepository.create(notificationData);

    await this.createUserNotificationUseCase.executeCreateMany(
      notification.id,
      input.userIds,
    );

    if (input.fcmTokens?.length) {
      await this.firebaseAdapter.sendMulticastNotification(
        input.fcmTokens,
        input.heading,
        input.body,
      );
    }
    return notification;
  }
}
