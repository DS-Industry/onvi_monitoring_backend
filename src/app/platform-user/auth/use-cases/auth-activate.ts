import { Injectable } from '@nestjs/common';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { SetRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-set-refresh-token';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { User } from '@platform-user/user/domain/user';
import { StatusUser } from '@prisma/client';

@Injectable()
export class ActivateAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
    private readonly userUpdate: UpdateUserUseCase,
  ) {}

  async execute(user: User) {
    const accessToken = await this.singAccessToken.execute(user.email, user.id);
    const refreshToken = await this.singRefreshToken.execute(
      user.email,
      user.id,
    );
    const correctUser = await this.setRefreshToken.execute(
      user.id,
      refreshToken.token,
    );
    const activeUser = await this.userUpdate.execute({
      id: correctUser.id,
      status: StatusUser.ACTIVE,
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
