import { OtpToken } from '../domain/otp-token';

export abstract class IOtpService {
  abstract generateOtp(phone: string): Promise<OtpToken>;
  abstract validateOtp(
    phone: string,
    code: string,
    deleteOnSuccess?: boolean,
  ): Promise<boolean>;
  abstract sendOtp(phone: string, code: string): Promise<void>;
  abstract getOtp(phone: string): Promise<OtpToken>;
  abstract removeOtp(phone: string): Promise<void>;
}
