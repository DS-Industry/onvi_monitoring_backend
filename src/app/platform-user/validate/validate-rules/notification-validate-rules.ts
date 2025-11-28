import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { User } from '@platform-user/user/domain/user';
import {
  NOTIFICATION_CREATE_TEG_EXCEPTION_CODE,
  NOTIFICATION_DELETE_TEG_EXCEPTION_CODE,
  NOTIFICATION_UPDATE_TEG_EXCEPTION_CODE,
} from '@constant/error.constants';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';
import { NotificationTagUpdateDto } from '@platform-user/validate/validate-rules/dto/notification-tag-update.dto';
import { UserNotificationUpdateDto } from '@platform-user/validate/validate-rules/dto/user-notification-update.dto';
import { UserNotification } from '@notification/userNotification/domain/userNotification';

@Injectable()
export class NotificationValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async updateUserNotificationValidate(
    data: UserNotificationUpdateDto,
    user: User,
  ): Promise<UserNotification> {
    const response = [];
    const checkUserNotification =
      await this.validateLib.userNotificationByIdExists(
        data.userNotificationId,
        user.id,
      );
    response.push(checkUserNotification);
    if (data.tagIds) {
      response.push(
        await this.validateLib.userNotificationTagIdsExists(
          data.tagIds,
          user.id,
        ),
      );
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.NOTIFICATION,
      NOTIFICATION_UPDATE_TEG_EXCEPTION_CODE,
    );
    return checkUserNotification.object;
  }

  public async createTagValidate(name: string, user: User) {
    const response = [];
    response.push(
      await this.validateLib.notificationTegByNameNotExists(name, user.id),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.NOTIFICATION,
      NOTIFICATION_CREATE_TEG_EXCEPTION_CODE,
    );
  }

  public async updateTagValidate(
    data: NotificationTagUpdateDto,
    user: User,
  ): Promise<UserNotificationTag> {
    const response = [];
    const checkTag = await this.validateLib.notificationTegByIdExists(
      data.tagId,
      user.id,
    );
    response.push(checkTag);
    if (data.name) {
      response.push(
        await this.validateLib.notificationTegByNameNotExists(
          data.name,
          user.id,
        ),
      );
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.NOTIFICATION,
      NOTIFICATION_UPDATE_TEG_EXCEPTION_CODE,
    );
    return checkTag.object;
  }

  public async deleteTagValidate(
    id: number,
    user: User,
  ): Promise<UserNotificationTag> {
    const response = [];
    const checkTag = await this.validateLib.notificationTegByIdExists(
      id,
      user.id,
    );
    response.push(checkTag);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.NOTIFICATION,
      NOTIFICATION_DELETE_TEG_EXCEPTION_CODE,
    );
    return checkTag.object;
  }
}
