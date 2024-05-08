import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { IDateAdapter } from '@libs/date/adapter';
import { OTP_EXPIRY_TIME } from '@constant/constants';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { SignAccessTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-refresh-token';
import { Client } from '@mobile-user/client/domain/client';
import { UpdateClientUseCase } from '@mobile-user/client/use-cases/client-update';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly dateService: IDateAdapter,
    private readonly clientRepository: IClientRepository,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly updateClient: UpdateClientUseCase,
  ) {}

  async execute(phone: string, otp: string): Promise<any> {
    const currentOtp = await this.otpRepository.findOne(phone);

    if (
      !currentOtp ||
      this.dateService.isExpired(currentOtp.expireDate, OTP_EXPIRY_TIME) ||
      currentOtp.confirmCode != otp
    ) {
      throw new Error('error');
    }

    const clientCheck = await this.clientRepository.findOneByPhone(phone);

    if (clientCheck) {
      throw new Error('error');
    }

    const clientData = new Client({
      name: `Onvi ${phone}`,
      phone: phone,
    });

    const client = await this.clientRepository.create(clientData);

    const accessToken = await this.singAccessToken.execute(phone, client.id);
    const refreshToken = await this.singRefreshToken.execute(phone, client.id);

    client.refreshTokenId = refreshToken.token;

    const correctClient = await this.updateClient.execute(client);

    return { correctClient, accessToken, refreshToken };
  }
}