import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { OTP_TIME } from '@constant/constants';
import { IDateAdapter } from '@libs/date/adapter';

@Injectable()
export class DateService implements IDateAdapter {
  constructor() {}
  isExpired(timestamp: Date, expiryTime: number): boolean {
    const currentTime = moment();
    const diff = currentTime.diff(timestamp);
    return diff > expiryTime;
  }
  generateOtpTime(): Date {
    const currentDateTime = moment();
    const futureDateTime = currentDateTime.add(OTP_TIME, 'minutes');

    return futureDateTime.toDate();
  }
}
