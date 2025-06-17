import { Provider } from "@nestjs/common";
import { IUserNotificationTagRepository } from "@notification/userNotificationTag/interface/userNotificationTag";
import { UserNotificationTagRepository } from "@notification/userNotificationTag/repository/userNotificationTag";

export const UserNotificationTagRepositoryProvider: Provider = {
  provide: IUserNotificationTagRepository,
  useClass: UserNotificationTagRepository,
}