import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '@notification/notification/interface/notification';
import { Notification } from '@notification/notification/domain/notification';

@Injectable()
export class FindMethodsNotificationUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async getById(id: number): Promise<Notification> {
    return await this.notificationRepository.findOneById(id);
  }

  async findAllByFilter(
    authorId?: number,
    skip?: number,
    take?: number,
  ): Promise<Notification[]> {
    return await this.notificationRepository.findAllByFilter(
      authorId,
      skip,
      take,
    );
  }
}
