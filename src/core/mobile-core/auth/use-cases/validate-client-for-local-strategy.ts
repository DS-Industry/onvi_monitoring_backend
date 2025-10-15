import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { UserStatus } from '../domain/user-status';

@Injectable()
export class ValidateClientForLocalStrategyUseCase {
  constructor(
    private readonly otpService: IOtpService,
    private readonly clientRepository: FindMethodsClientUseCase,
  ) {}

  async execute(phone: string, otp: string): Promise<Client | { register: boolean }> {
    const isValidOtp = await this.otpService.validateOtp(phone, otp);
    if (!isValidOtp) {
      throw new Error('Invalid OTP');
    }

    const client = await this.clientRepository.getByPhone(phone);
    
    if (!client) {
      return { register: true };
    }

    if (client.status === UserStatus.BLOCKED || client.status === UserStatus.DELETED) {
      throw new Error('Client account is blocked or deleted');
    }

    if (client.status !== UserStatus.ACTIVE) {
      throw new Error('Client account is not active');
    }

    return client;
  }
}
