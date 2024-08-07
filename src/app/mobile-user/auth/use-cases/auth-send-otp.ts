import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import * as otpGenerator from 'otp-generator';
import { IDateAdapter } from '@libs/date/adapter';
import { Otp } from '@mobile-user/otp/domain/otp';
import { ISmsAdapter } from '@libs/sms/adapter';

@Injectable()
export class SendOtpAuthUseCase {
  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly dateService: IDateAdapter,
    private readonly smsService: ISmsAdapter,
  ) {}

  async execute(phone: string): Promise<any> {
    const otpTime = this.dateService.generateOtpTime();
    const otpCode = this.generateOtp();
    const otpModel = new Otp({
      phone: phone,
      confirmCode: otpCode,
      expireDate: otpTime,
      createDate: new Date(Date.now()),
    });
    const oldOtp = await this.otpRepository.findOne(phone);
    if (oldOtp) {
      await this.otpRepository.removeOne(phone);
    }
    const otp = await this.otpRepository.create(otpModel);
    await this.smsService.send(otp, 'Ваш код доступа: ');
    return otp;
  }

  private generateOtp() {
    return otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  }
}
