import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import { SignAccessTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-refresh-token';
import { SetRefreshTokenUseCase } from '@platform-admin/auth/use-cases/auth-set-refresh-token';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { StatusUser } from "@prisma/client";

@Injectable()
export class ActivateAuthUseCase {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
    private readonly adminUpdate: UpdateAdminUseCase,
  ) {}

  async execute(admin: Admin) {
    const accessToken = await this.singAccessToken.execute(
      admin.email,
      admin.id,
    );
    const refreshToken = await this.singRefreshToken.execute(
      admin.email,
      admin.id,
    );
    const correctAdmin = await this.setRefreshToken.execute(
      admin.id,
      refreshToken.token,
    );
    const activeAdmin = await this.adminUpdate.execute({
      id: correctAdmin.id,
      status: StatusUser.ACTIVE,
    });
    return {
      admin: activeAdmin,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
