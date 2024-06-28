import { Otp } from '@mobile-user/otp/domain/otp';

export abstract class ISmsAdapter {
  abstract send(input: Otp, text: string): Promise<any>;
}
