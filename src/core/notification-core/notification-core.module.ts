import { Module, Provider } from '@nestjs/common';
import { NotificationRepositoryProvider } from '@notification/notification/provider/notification';
import { FindMethodsNotificationUseCase } from '@notification/notification/use-case/notification-find-methods';
import { UserNotificationRepositoryProvider } from '@notification/userNotification/provider/userNotification';
import { UserNotificationTagRepositoryProvider } from '@notification/userNotificationTag/provider/userNotificationTag';
import { FindMethodsUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-find-methods';
import { FindMethodsUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-find-methods';
import { CreateUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-create';
import { DeleteUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-delete';
import { UpdateUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-update';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UpdateUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-update';
import { CreateUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-create';
import { CreateNotificationUseCase } from '@notification/notification/use-case/notification-create';
import { NotificationStrategy } from '@notification/protection/notification.strategies';
import { UserNotificationUnreadWs } from '@notification/userNotification/use-case/userNotification-unread-ws';
import { NotificationHandlerEventUseCase } from '@notification/notification/use-case/notification-handler-event';
import { FirebaseModule } from '@libs/firebase/module';

const repositories: Provider[] = [
  NotificationRepositoryProvider,
  UserNotificationRepositoryProvider,
  UserNotificationTagRepositoryProvider,
];

const notificationUseCases: Provider[] = [
  CreateNotificationUseCase,
  FindMethodsNotificationUseCase,
  NotificationHandlerEventUseCase,
];

const userNotificationUseCases: Provider[] = [
  CreateUserNotificationUseCase,
  FindMethodsUserNotificationUseCase,
  UpdateUserNotificationUseCase,
];

const userNotificationTagUseCases: Provider[] = [
  FindMethodsUserNotificationTagUseCase,
  CreateUserNotificationTagUseCase,
  DeleteUserNotificationTagUseCase,
  UpdateUserNotificationTagUseCase,
];

const authNotificationUseCases: Provider[] = [
  NotificationStrategy,
  UserNotificationUnreadWs,
];
@Module({
  imports: [PrismaModule, FirebaseModule],
  providers: [
    ...repositories,
    ...notificationUseCases,
    ...userNotificationUseCases,
    ...userNotificationTagUseCases,
    ...authNotificationUseCases,
  ],
  exports: [
    ...notificationUseCases,
    ...userNotificationUseCases,
    ...userNotificationTagUseCases,
    ...authNotificationUseCases,
  ],
})
export class NotificationCoreModule {}
