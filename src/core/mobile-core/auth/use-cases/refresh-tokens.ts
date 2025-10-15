import { Injectable } from '@nestjs/common';
import { ITokenService } from '../interfaces/token-service';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';

export interface RefreshTokensRequest {
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  accessTokenExp: Date;
}

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly authRepository: IClientAuthRepository,
  ) {}

  async execute(request: RefreshTokensRequest): Promise<RefreshTokensResponse> {
    const { refreshToken } = request;

    const payload = await this.tokenService.validateRefreshToken(refreshToken);
    
    const session = await this.authRepository.findActiveSessionByRefreshToken(refreshToken);
    if (!session || !session.isActive) {
      throw new Error('Invalid or expired refresh token');
    }

    const newAccessToken = await this.tokenService.generateAccessToken({
      phone: payload.phone,
      clientId: payload.clientId,
    });

    return {
      accessToken: newAccessToken.token,
      accessTokenExp: newAccessToken.expirationDate,
    };
  }
}
