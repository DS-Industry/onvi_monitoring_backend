import { Injectable } from '@nestjs/common';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { User } from '@platform-user/user/domain/user';
import { StatusUser } from '@prisma/client';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';

@Injectable()
export class ActivateAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(user: User) {
    const accessToken = await this.singAccessToken.execute(user.email, user.id);
    const refreshToken = await this.singRefreshToken.execute(
      user.email,
      user.id,
    );
    const hashedRefreshToken = await this.bcrypt.hash(refreshToken.token);
    const activeUser = await this.userUpdate.execute({
      id: user.id,
      status: StatusUser.ACTIVE,
      refreshTokenId: hashedRefreshToken,
    });
    return {
      user: activeUser,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
