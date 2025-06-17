import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationUseCase } from '@notification/notification/use-case/notification-create';
import { OnEvent } from '@nestjs/event-emitter';
import { EventHandlerDto } from '@notification/notification/use-case/dto/event-handler.dto';
import { CustomHttpException } from '@exception/custom-http.exception';

@Injectable()
export class NotificationHandlerEventUseCase {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @OnEvent('notification.*')
  async handlerNotificationEvent(payload: EventHandlerDto) {
    try {
      console.log('notification event ' + payload.eventType);
      await this.createNotificationUseCase.execute({
        heading: payload.heading,
        body: payload.body,
        userIds: payload.userIds,
        fcmTokens: payload.fcmTokens,
        authorId: payload?.authorId,
      });
    } catch (error) {
      throw new CustomHttpException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
