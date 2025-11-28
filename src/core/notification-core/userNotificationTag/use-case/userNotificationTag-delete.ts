import { Injectable } from '@nestjs/common';
import { IUserNotificationTagRepository } from '@notification/userNotificationTag/interface/userNotificationTag';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';

@Injectable()
export class DeleteUserNotificationTagUseCase {
  constructor(
    private readonly userNotificationTagRepository: IUserNotificationTagRepository,
  ) {}

  async execute(input: UserNotificationTag): Promise<void> {
    await this.userNotificationTagRepository.delete(input);
  }
}
