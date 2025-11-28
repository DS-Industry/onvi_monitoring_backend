import { Injectable } from '@nestjs/common';
import { ITokenService } from '../interfaces/token-service';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

export interface ValidateRefreshTokenForJwtStrategyRequest {
  refreshToken: string;
  phone: string;
}

@Injectable()
export class ValidateRefreshTokenForJwtStrategyUseCase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly authRepository: IClientAuthRepository,
    private readonly clientRepository: FindMethodsClientUseCase,
  ) {}

  async execute(
    request: ValidateRefreshTokenForJwtStrategyRequest,
  ): Promise<{ client: Client; refreshToken: string }> {
    const { refreshToken, phone } = request;

    const payload = await this.tokenService.validateRefreshToken(refreshToken);

    if (payload.phone !== phone) {
      throw new Error('Phone mismatch in token payload');
    }

    const session =
      await this.authRepository.findActiveSessionByRefreshToken(refreshToken);
    if (!session || !session.isActive) {
      throw new Error('Invalid or expired refresh token');
    }

    const client = await this.clientRepository.getByPhone(phone);
    if (!client) {
      throw new Error('Client not found');
    }

    if (client.status !== StatusUser.ACTIVE) {
      throw new Error('Client account is not active');
    }

    return {
      client,
      refreshToken,
    };
  }
}
