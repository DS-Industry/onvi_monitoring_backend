import { Injectable } from '@nestjs/common';
import { SignAccessTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-refresh-token';
import { SetRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-set-refresh-token';

@Injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
  ) {}

  async execute(phone: string, id: number): Promise<any> {
    const accessToken = await this.singAccessToken.execute(phone, id);
    const refreshToken = await this.singRefreshToken.execute(phone, id);
    const client = await this.setRefreshToken.execute(id, refreshToken.token);
    return {
      client: client,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
