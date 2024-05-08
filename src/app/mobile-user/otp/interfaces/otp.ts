import { Otp } from '@mobile-user/otp/domain/otp';

export abstract class IOtpRepository {
  abstract create(input: Otp): Promise<Otp>;
  abstract findOne(phone: string): Promise<Otp>;
  abstract removeOne(phone: string): Promise<void>;
  abstract send(input: Otp): Promise<any>;
}
