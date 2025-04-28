import { Injectable } from '@nestjs/common';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';

@Injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(email: string, id: number): Promise<any> {
    const accessToken = await this.singAccessToken.execute(email, id);
    const refreshToken = await this.singRefreshToken.execute(email, id);
    const hashedRefreshToken = await this.bcrypt.hash(refreshToken.token);
    const updateUser = await this.userUpdate.execute({
      id: id,
      refreshTokenId: hashedRefreshToken,
    });
    return {
      admin: updateUser,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
