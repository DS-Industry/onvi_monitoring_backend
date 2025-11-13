import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  status: string;
  target: string;
}

@Injectable()
export class SendOtpUseCase {
  constructor(private readonly otpService: IOtpService) {}

  async execute(request: SendOtpRequest): Promise<SendOtpResponse> {
    const otpToken = await this.otpService.generateOtp(request.phone);

    console.log('otpToken', otpToken);

    await this.otpService.sendOtp(request.phone, otpToken.code);

    return {
      status: 'SUCCESS',
      target: request.phone,
    };
  }
}
