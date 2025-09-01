import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../../../../core/loyalty-core/mobile-user/client/interfaces/client';
import { Client } from '../../../../core/loyalty-core/mobile-user/client/domain/client';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { StatusUser } from '@prisma/client';
import { InvalidOtpException } from '@mobile-user/shared/exceptions/auth.exceptions';

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
      throw new InvalidOtpException(phone);
    }

    const client = await this.clientRepository.findOneByPhone(phone);

    if (!client && client.status !== StatusUser.ACTIVE) {
      return null;
    }

    return client;
  }
}
