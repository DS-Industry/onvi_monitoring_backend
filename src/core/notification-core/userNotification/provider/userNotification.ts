import { Provider } from '@nestjs/common';
import { IUserNotificationRepository } from '@notification/userNotification/interface/userNotification';
import { UserNotificationRepository } from '@notification/userNotification/repository/userNotification';

export const UserNotificationRepositoryProvider: Provider = {
  provide: IUserNotificationRepository,
  useClass: UserNotificationRepository,
};
