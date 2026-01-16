import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class ValidateClientForLocalStrategyUseCase {
  constructor(
    private readonly otpService: IOtpService,
    private readonly clientRepository: FindMethodsClientUseCase,
  ) {}

  async execute(
    phone: string,
    otp: string,
  ): Promise<Client | { register: boolean }> {
    const isValidOtp = await this.otpService.validateOtp(phone, otp, false);
    if (!isValidOtp) {
      throw new Error('Invalid OTP');
    }

    const client = await this.clientRepository.getByPhone(phone);

    if (!client) {
      return { register: true };
    }

    await this.otpService.removeOtp(phone);

    if (
      client.status === StatusUser.BLOCKED ||
      client.status === StatusUser.DELETED
    ) {
      throw new Error('Client account is blocked or deleted');
    }

    if (client.status !== StatusUser.ACTIVE) {
      throw new Error('Client account is not active');
    }

    return client;
  }
}
