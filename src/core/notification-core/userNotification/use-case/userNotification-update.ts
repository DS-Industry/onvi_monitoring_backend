import { Injectable } from '@nestjs/common';
import { IUserNotificationRepository } from '@notification/userNotification/interface/userNotification';
import {
  ReadStatus,
  UserNotificationUpdateDto,
} from '@notification/userNotification/use-case/dto/userNotification-update.dto';
import { UserNotification } from '@notification/userNotification/domain/userNotification';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
import { FindMethodsUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-find-methods';
import { FindMethodsUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-find-methods';

@Injectable()
export class UpdateUserNotificationUseCase {
  constructor(
    private readonly userNotificationRepository: IUserNotificationRepository,
    private readonly findMethodsUserNotificationUseCase: FindMethodsUserNotificationUseCase,
    private readonly findMethodsUserNotificationTagUseCase: FindMethodsUserNotificationTagUseCase,
  ) {}

  async execute(
    input: UserNotificationUpdateDto,
    oldUserNotification: UserNotification,
  ): Promise<FullDataUserNotificationDto> {
    if (input.readStatus) {
      oldUserNotification.openingAt =
        input.readStatus === ReadStatus.READ ? new Date() : null;
    }

    oldUserNotification.type = input.type
      ? input.type
      : oldUserNotification.type;

    const userNotification =
      await this.userNotificationRepository.update(oldUserNotification);
    if (input.tagIds) {
      const userNotificationTags =
        await this.findMethodsUserNotificationTagUseCase.getAllByFilter({
          userNotificationId: userNotification.id,
        });
      const existingTagIds = userNotificationTags.map((tag) => tag.id);
      const deleteTagIds = existingTagIds.filter(
        (id) => !input.tagIds.includes(id),
      );
      const addTagIds = input.tagIds.filter(
        (id) => !existingTagIds.includes(id),
      );
      await this.userNotificationRepository.updateConnectionTag(
        userNotification.id,
        addTagIds,
        deleteTagIds,
      );
    }

    return await this.findMethodsUserNotificationUseCase.getFullById(
      userNotification.id,
    );
  }

  async readAll(userId: number): Promise<any> {
    return await this.userNotificationRepository.updateReadAll(
      userId,
      new Date(),
    );
  }
}
