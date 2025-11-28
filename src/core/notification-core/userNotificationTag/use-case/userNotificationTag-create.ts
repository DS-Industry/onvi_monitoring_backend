import { Injectable } from '@nestjs/common';
import { IUserNotificationTagRepository } from '@notification/userNotificationTag/interface/userNotificationTag';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateUserNotificationTagUseCase {
  constructor(
    private readonly userNotificationTagRepository: IUserNotificationTagRepository,
  ) {}

  async execute(
    name: string,
    color: string,
    user: User,
  ): Promise<UserNotificationTag> {
    const userNotificationTag = new UserNotificationTag({
      name: name,
      color: color,
      authorUserId: user.id,
    });
    return await this.userNotificationTagRepository.create(userNotificationTag);
  }
}
