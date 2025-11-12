import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';
import { OtpToken } from '../domain/otp-token';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { IDateAdapter } from '@libs/date/adapter';
import { ISmsAdapter } from '@libs/sms/adapter';
import { Otp } from '@mobile-user/otp/domain/otp';
import { AUTH_CONSTANTS } from '../domain/constants';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class RedisOtpService extends IOtpService {
  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly dateService: IDateAdapter,
    private readonly smsService: ISmsAdapter,
  ) {
    super();
  }

  async generateOtp(phone: string): Promise<OtpToken> {
    const otpTime = this.dateService.generateOtpTime();
    const otpCode = this.generateOtpCode();

    const oldOtp = await this.otpRepository.findOne(phone);
    if (oldOtp) {
      await this.otpRepository.removeOne(phone);
    }

    const otpModel = new Otp({
      phone: phone,
      confirmCode: otpCode,
      expireDate: otpTime,
      createDate: new Date(Date.now()),
    });

    await this.otpRepository.create(otpModel);

    return OtpToken.create(
      phone,
      otpCode,
      AUTH_CONSTANTS.OTP_EXPIRY_TIME_MINUTES,
    );
  }

  async validateOtp(phone: string, code: string): Promise<boolean> {
    const currentOtp = await this.otpRepository.findOne(phone);

    if (!currentOtp) {
      return false;
    }

    if (
      this.dateService.isExpired(
        currentOtp.expireDate,
        AUTH_CONSTANTS.OTP_EXPIRY_TIME_MINUTES,
      )
    ) {
      return false;
    }

    if (currentOtp.confirmCode !== code) {
      return false;
    }

    await this.otpRepository.removeOne(phone);
    return true;
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    const otpModel = new Otp({
      phone: phone,
      confirmCode: code,
      expireDate: new Date(),
      createDate: new Date(),
    });

    await this.smsService.send(otpModel, 'Ваш код доступа: ');
  }

  async getOtp(phone: string): Promise<OtpToken> {
    const otp = await this.otpRepository.findOne(phone);
    if (!otp) {
      return null;
    }

    return new OtpToken({
      phone: otp.phone,
      code: otp.confirmCode,
      expiresAt: otp.expireDate,
      isUsed: false,
      createdAt: otp.createDate,
    });
  }

  async removeOtp(phone: string): Promise<void> {
    await this.otpRepository.removeOne(phone);
  }

  private generateOtpCode(): string {
    return otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  }
}
