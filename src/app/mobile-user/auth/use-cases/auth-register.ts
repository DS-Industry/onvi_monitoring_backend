import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { IClientRepository } from '../../../../core/loyalty-core/mobile-user/client/interfaces/client';
import { SignAccessTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-refresh-token';
import { Client } from '../../../../core/loyalty-core/mobile-user/client/domain/client';
import { SetRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-set-refresh-token';
import { ContractType, StatusUser } from '@prisma/client';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly dateService: IDateAdapter,
    private readonly clientRepository: IClientRepository,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
  ) {}

  async execute(phone: string, otp: string): Promise<any> {
    //Otp validation
    const currentOtp = await this.otpRepository.findOne(phone);

    if (
      !currentOtp ||
      this.dateService.isExpired(currentOtp.expireDate, OTP_EXPIRY_TIME) ||
      currentOtp.confirmCode != otp
    ) {
      throw new Error('error');
    }

    //Check if client already exists
    const clientCheck = await this.clientRepository.findOneByPhone(phone);

    if (clientCheck) {
      throw new Error('error');
    }

    if (
      clientCheck.status === StatusUser.BLOCKED ||
      clientCheck.status === StatusUser.DELETED
    ) {
      throw new Error('User is blocked or deleted');
    }

    //Verify if client has a card & is active

    const clientData = new Client({
      name: `Onvi ${phone}`,
      phone: phone,
      contractType: ContractType.INDIVIDUAL,
    });

    const client = await this.clientRepository.create(clientData);

    const accessToken = await this.singAccessToken.execute(phone, client.id);
    const refreshToken = await this.singRefreshToken.execute(phone, client.id);

    const correctClient = await this.setRefreshToken.execute(
      client.id,
      refreshToken.token,
    );

    return { correctClient, accessToken, refreshToken };
  }
}
