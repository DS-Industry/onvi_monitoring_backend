import { Injectable } from '@nestjs/common';
import { IUserNotificationTagRepository } from '@notification/userNotificationTag/interface/userNotificationTag';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';

@Injectable()
export class FindMethodsUserNotificationTagUseCase {
  constructor(
    private readonly userNotificationTagRepository: IUserNotificationTagRepository,
  ) {}

  async getAll(): Promise<UserNotificationTag[]> {
    return await this.userNotificationTagRepository.findAll();
  }

  async getAllByFilter(filter: {
    authorUserId?: number;
    userNotificationId?: number;
    name?: string;
  }): Promise<UserNotificationTag[]> {
    return await this.userNotificationTagRepository.findAllByFilter(
      filter.authorUserId,
      filter.userNotificationId,
      filter.name,
    );
  }

  async getOneById(id: number): Promise<UserNotificationTag> {
    return await this.userNotificationTagRepository.findOneById(id);
  }
}
