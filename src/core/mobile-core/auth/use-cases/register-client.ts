import { Injectable } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp-service';
import { ITokenService } from '../interfaces/token-service';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { IClientRepository } from '@loyalty/mobile-user/client/interfaces/client';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientSession } from '../domain/client-session';
import { ContractType } from '../domain/contract-type';
import { UserStatus } from '../domain/user-status';

export interface RegisterClientRequest {
  phone: string;
  otp: string;
}

export interface RegisterClientResponse {
  client: Client;
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExp: Date;
    refreshTokenExp: Date;
  };
}

@Injectable()
export class RegisterClientUseCase {
  constructor(
    private readonly otpService: IOtpService,
    private readonly tokenService: ITokenService,
    private readonly authRepository: IClientAuthRepository,
    private readonly clientRepository: IClientRepository,
    private readonly findClientUseCase: FindMethodsClientUseCase,
  ) {}

  async execute(request: RegisterClientRequest): Promise<RegisterClientResponse> {
    const { phone, otp } = request;

    const isValidOtp = await this.otpService.validateOtp(phone, otp);
    if (!isValidOtp) {
      throw new Error('Invalid OTP');
    }

    const existingClient = await this.findClientUseCase.getByPhone(phone);
    if (existingClient) {
      if (existingClient.status === UserStatus.BLOCKED || existingClient.status === UserStatus.DELETED) {
        throw new Error('Client account is blocked or deleted');
      }
      throw new Error('Client already exists');
    }

    const clientData = new Client({
      name: `Onvi ${phone}`,
      phone: phone,
      contractType: ContractType.INDIVIDUAL,
      status: UserStatus.ACTIVE,
    });

    const client = await this.clientRepository.create(clientData);

    const tokens = await this.tokenService.generateTokens({
      phone: client.phone,
      clientId: client.id,
    });

    const session = new ClientSession({
      clientId: client.id,
      phone: client.phone,
      isActive: true,
      createdAt: new Date(),
    });
    
    session.setRefreshToken(tokens.refreshToken);
    await this.authRepository.createSession(session);

    return {
      client,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExp: tokens.accessTokenExpiresAt,
        refreshTokenExp: tokens.refreshTokenExpiresAt,
      },
    };
  }
}
