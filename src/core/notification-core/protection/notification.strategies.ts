import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { NotificationException } from '@exception/option.exceptions';
import { NOTIFICATION_AUTH_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class NotificationStrategy extends PassportStrategy(
  Strategy,
  'notification',
) {
  constructor() {
    super(
      { header: 'NOTIFICATION-KEY', prefix: '' },
      true,
      async (notificationKey, done) => {
        return this.validate(notificationKey, done);
      },
    );
  }

  async validate(
    notificationKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    try {
    } catch (error) {
      done(
        new NotificationException(
          NOTIFICATION_AUTH_EXCEPTION_CODE,
          'Unauthorized access',
        ),
        null,
      );
    }
  }
}
