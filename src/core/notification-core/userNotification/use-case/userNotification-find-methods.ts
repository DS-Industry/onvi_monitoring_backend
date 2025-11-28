import { Injectable } from '@nestjs/common';
import { IUserNotificationRepository } from '@notification/userNotification/interface/userNotification';
import { UserNotification } from '@notification/userNotification/domain/userNotification';
import { UserNotificationType } from '@prisma/client';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';

@Injectable()
export class FindMethodsUserNotificationUseCase {
  constructor(
    private readonly userNotificationRepository: IUserNotificationRepository,
  ) {}

  async getById(id: number): Promise<UserNotification> {
    return await this.userNotificationRepository.findOneById(id);
  }

  async getFullById(id: number): Promise<FullDataUserNotificationDto> {
    return await this.userNotificationRepository.findOneFullById(id);
  }

  async getAllByFilter(
    notificationId?: number,
    userId?: number,
    type?: UserNotificationType,
    tagId?: number,
    skip?: number,
    take?: number,
  ): Promise<UserNotification[]> {
    return await this.userNotificationRepository.findAllByFilter(
      notificationId,
      userId,
      type,
      tagId,
      skip,
      take,
    );
  }

  async getAllFullByFilter(filter: {
    userId?: number;
    type?: UserNotificationType;
    tagId?: number;
    readStatus?: ReadStatus;
    skip?: number;
    take?: number;
  }): Promise<FullDataUserNotificationDto[]> {
    return await this.userNotificationRepository.findAllFullByFilter(
      filter.userId,
      filter.type,
      filter.tagId,
      filter.readStatus,
      filter.skip,
      filter.take,
    );
  }
}
