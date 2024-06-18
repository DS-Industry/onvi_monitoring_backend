import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { Client } from '@mobile-user/client/domain/client';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { StatusUser } from "@prisma/client";

@Injectable()
export class ValidateClientForLocalStrategyUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly otpRepository: IOtpRepository,
    private readonly dateService: IDateAdapter,
  ) {}

  async execute(phone: string, otp: string): Promise<Client> {
    const currentOtp = await this.otpRepository.findOne(phone);
    if (
      !currentOtp ||
      this.dateService.isExpired(currentOtp.expireDate, OTP_EXPIRY_TIME) ||
      currentOtp.confirmCode != otp
    ) {
      throw new Error('error');
    }

    const client = await this.clientRepository.findOneByPhone(phone);

    if (!client) {
      return null;
    }
    if (client.status !== StatusUser.ACTIVE) {
      throw new Error('authorization error');
    }
    return client;
  }
}
