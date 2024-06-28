import { Injectable } from '@nestjs/common';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SetRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-set-refresh-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';

@Injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
  ) {}

  async execute(email: string, id: number): Promise<any> {
    const accessToken = await this.singAccessToken.execute(email, id);
    const refreshToken = await this.singRefreshToken.execute(email, id);
    const admin = await this.setRefreshToken.execute(id, refreshToken.token);
    return {
      admin: admin,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
