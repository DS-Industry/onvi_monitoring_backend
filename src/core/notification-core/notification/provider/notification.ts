import { Provider } from '@nestjs/common';
import { INotificationRepository } from '@notification/notification/interface/notification';
import { NotificationRepository } from '@notification/notification/repository/notification';

export const NotificationRepositoryProvider: Provider = {
  provide: INotificationRepository,
  useClass: NotificationRepository,
};
