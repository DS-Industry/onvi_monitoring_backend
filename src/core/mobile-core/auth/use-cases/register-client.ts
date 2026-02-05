import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOtpService } from '../interfaces/otp-service';
import { ITokenService } from '../interfaces/token-service';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { IClientRepository } from '@loyalty/mobile-user/client/interfaces/client';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientSession } from '../domain/client-session';
import { ContractType } from '@loyalty/mobile-user/client/domain/enums';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';



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
    private readonly cardRepository: ICardRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    request: RegisterClientRequest,
  ): Promise<RegisterClientResponse> {
    const { phone, otp } = request;

    const isValidOtp = await this.otpService.validateOtp(phone, otp);
    if (!isValidOtp) {
      throw new Error('Invalid OTP');
    }

    const existingClient = await this.findClientUseCase.getByPhone(phone);

    let client: Client;

    if (existingClient) {
      if (
        existingClient.status === StatusUser.BLOCKED
      ) {
        throw new Error('Client account is blocked or deleted');
      }
      existingClient.status = StatusUser.ACTIVE;
      client = await this.clientRepository.update(existingClient);
    } else {
      const clientData = new Client({
        name: `Onvi ${phone}`,
        phone: phone,
        contractType: ContractType.INDIVIDUAL,
        status: StatusUser.ACTIVE,
      });

      client = await this.clientRepository.create(clientData);

      const organizationId = this.configService.get<number>('onviOrganizationId');
      const loyaltyProgramId = this.configService.get<number>('onviProgramId');

      await this.createCardForClient(
        client.id,
        organizationId,
        loyaltyProgramId,
      );
    }

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

  private async createCardForClient(
    clientId: number,
    organizationId?: number,
    loyaltyProgramId?: number,
  ): Promise<Card> {
    const devNumber = await this.generateDevNomerCard();
    const number = await this.generateNomerCard();

    let cardTierId: number | undefined;

    if (loyaltyProgramId) {
      const tiers =
        await this.findMethodsLoyaltyTierUseCase.getAllByLoyaltyProgramId(
          loyaltyProgramId,
        );

      if (tiers.length > 0) {
        const tierWithSmallestLimit = tiers.reduce((prev, current) =>
          prev.limitBenefit < current.limitBenefit ? prev : current,
        );
        cardTierId = tierWithSmallestLimit.id;
      }
    }

    const card = new Card({
      balance: 0,
      status: undefined,
      mobileUserId: clientId,
      devNumber,
      number,
      organizationId,
      loyaltyCardTierId: cardTierId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.cardRepository.create(card);
  }

  private async generateDevNomerCard(): Promise<string> {
    let newNomer = '';
    do {
      newNomer = this.generateRandom12DigitNumber();
    } while (await this.findMethodsCardUseCase.getByDevNumber(newNomer));
    return newNomer;
  }

  private async generateNomerCard(): Promise<string> {
    let newNomer = '';
    do {
      newNomer = this.generateRandom12DigitNumber();
    } while (await this.findMethodsCardUseCase.getByNumber(newNomer));
    return newNomer;
  }

  private generateRandom12DigitNumber(): string {
    const min = 100000000000;
    const max = 999999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }
}
