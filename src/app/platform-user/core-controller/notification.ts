import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { TagCreateDto } from '@platform-user/core-controller/dto/receive/tag-create.dto';
import { UserNotificationTag } from '@notification/userNotificationTag/domain/userNotificationTag';
import { NotificationException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { NotificationValidateRules } from '@platform-user/validate/validate-rules/notification-validate-rules';
import { CreateUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-create';
import { FindMethodsUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-find-methods';
import { DeleteUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-delete';
import { NotificationTagUpdateDto } from '@platform-user/core-controller/dto/receive/notification-tag-update.dto';
import { UpdateUserNotificationTagUseCase } from '@notification/userNotificationTag/use-case/userNotificationTag-update';
import { FullDataUserNotificationDto } from '@notification/userNotification/use-case/dto/full-data-userNotification.dto';
import { FindMethodsUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-find-methods';
import { UserNotificationFindAllFilterDto } from '@platform-user/core-controller/dto/receive/user-notification-find-all-filter.dto';
import { UserNotificationUpdateDto } from '@platform-user/core-controller/dto/receive/user-notification-update.dto';
import { UpdateUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-update';
import { UserNotificationUnreadWs } from '@notification/userNotification/use-case/userNotification-unread-ws';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly createUserNotificationTagUseCase: CreateUserNotificationTagUseCase,
    private readonly updateUserNotificationTagUseCase: UpdateUserNotificationTagUseCase,
    private readonly findMethodsUserNotificationTagUseCase: FindMethodsUserNotificationTagUseCase,
    private readonly deleteUserNotificationTagUseCase: DeleteUserNotificationTagUseCase,
    private readonly findMethodsUserNotificationUseCase: FindMethodsUserNotificationUseCase,
    private readonly updateUserNotificationUseCase: UpdateUserNotificationUseCase,
    private readonly userNotificationUnreadWs: UserNotificationUnreadWs,
    private readonly notificationValidateRules: NotificationValidateRules,
  ) {}
  //Count of unread notifications
  @Post('unread')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async unreadCountNotification(
    @Request() req: any,
  ): Promise<{ status: string }> {
    try {
      const { user } = req;
      await this.userNotificationUnreadWs.broadcastNotification(user.id);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all userNotification
  @Patch('read-all')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async readAllNotifications(@Request() req: any): Promise<{ status: string }> {
    try {
      const { user } = req;
      await this.updateUserNotificationUseCase.readAll(user.id);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all userNotification
  @Get('user-notification')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async getAllUserNotifications(
    @Request() req: any,
    @Query() data: UserNotificationFindAllFilterDto,
  ): Promise<FullDataUserNotificationDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      const { user } = req;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.findMethodsUserNotificationUseCase.getAllFullByFilter({
        userId: user.id,
        type: data.type,
        tagId: data.tagId,
        readStatus: data.readStatus,
        skip: skip,
        take: take,
      });
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update userNotification
  @Patch('user-notification')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async updateUserNotifications(
    @Request() req: any,
    @Body() data: UserNotificationUpdateDto,
  ): Promise<FullDataUserNotificationDto> {
    try {
      const { user } = req;
      const userNotification =
        await this.notificationValidateRules.updateUserNotificationValidate(
          data,
          user,
        );
      return await this.updateUserNotificationUseCase.execute(
        data,
        userNotification,
      );
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create tag
  @Post('tag')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async createTag(
    @Request() req: any,
    @Body() data: TagCreateDto,
  ): Promise<UserNotificationTag> {
    try {
      const { user } = req;
      await this.notificationValidateRules.createTagValidate(data.name, user);
      return await this.createUserNotificationTagUseCase.execute(
        data.name,
        data.color,
        user,
      );
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Patch tag
  @Patch('tag')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async patchTag(
    @Request() req: any,
    @Body() data: NotificationTagUpdateDto,
  ): Promise<UserNotificationTag> {
    try {
      const { user } = req;
      const oldTag = await this.notificationValidateRules.updateTagValidate(
        data,
        user,
      );
      return await this.updateUserNotificationTagUseCase.execute(data, oldTag);
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all tags
  @Get('tag')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async getAllTags(@Request() req: any): Promise<UserNotificationTag[]> {
    try {
      const { user } = req;
      return await this.findMethodsUserNotificationTagUseCase.getAllByFilter({
        authorUserId: user.id,
      });
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Delete tag
  @Delete('tag/:id')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async deleteTag(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ status: string }> {
    try {
      const { user } = req;
      const notificationTag =
        await this.notificationValidateRules.deleteTagValidate(id, user);
      await this.deleteUserNotificationTagUseCase.execute(notificationTag);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof NotificationException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
