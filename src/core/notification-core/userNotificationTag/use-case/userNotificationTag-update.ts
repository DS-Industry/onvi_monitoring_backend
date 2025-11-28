import { Injectable } from '@nestjs/common';
import { IUserNotificationTagRepository } from '@notification/userNotificationTag/interface/userNotificationTag';
import { UpdateDto } from '@notification/userNotificationTag/use-case/dto/update.dto';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';

@Injectable()
export class UpdateUserNotificationTagUseCase {
  constructor(
    private readonly userNotificationTagRepository: IUserNotificationTagRepository,
  ) {}

  async execute(
    input: UpdateDto,
    oldTag: UserNotificationTag,
  ): Promise<UserNotificationTag> {
    const { name, color } = input;

    oldTag.name = name ? name : oldTag.name;
    oldTag.color = color ? color : oldTag.color;

    return await this.userNotificationTagRepository.update(oldTag);
  }
}
