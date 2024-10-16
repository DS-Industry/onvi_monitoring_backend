import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser, StatusUser } from '@prisma/client';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { AuthRegisterWorkerDto } from '@platform-user/auth/use-cases/dto/auth-register-worker.dto';

@Injectable()
export class AuthRegisterWorkerUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly bcrypt: IBcryptAdapter,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly validateOrganizationMail: ValidateOrganizationConfirmMailUseCase,
  ) {}

  async execute(
    input: AuthRegisterWorkerDto,
    organizationIdConfirmMail: number,
  ): Promise<any> {
    const hashPassword = await this.bcrypt.hash(input.password);
    const userData = new User({
      name: input.name,
      surname: input.surname,
      middlename: input.middlename,
      birthday: input.birthday,
      userRoleId: 1,
      phone: input.phone,
      email: input.email,
      password: hashPassword,
      gender: input.gender,
      position: PositionUser.Operator,
      status: StatusUser.ACTIVE,
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      receiveNotifications: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.createWorker(
      userData,
      organizationIdConfirmMail,
    );
    const accessToken = await this.singAccessToken.execute(user.email, user.id);
    const refreshToken = await this.singRefreshToken.execute(
      user.email,
      user.id,
    );
    const hashedRefreshToken = await this.bcrypt.hash(refreshToken.token);
    const correctUser = await this.userUpdate.execute({
      id: user.id,
      refreshTokenId: hashedRefreshToken,
    });
    return {
      user: correctUser,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }
}
