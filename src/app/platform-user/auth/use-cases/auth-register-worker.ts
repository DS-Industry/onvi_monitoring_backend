import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { StatusUser } from '@prisma/client';
import { AuthRegisterWorkerDto } from '@platform-user/auth/controller/dto/auth-register-worker.dto';
import { ValidateOrganizationConfirmMailUseCase } from '../../../../core/business-core/organization/confirmMail/use-case/confirm-mail-validate';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { SetRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-set-refresh-token';

@Injectable()
export class AuthRegisterWorkerUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly setRefreshToken: SetRefreshTokenUseCase,
    private readonly validateOrganizationMail: ValidateOrganizationConfirmMailUseCase,
  ) {}

  async execute(input: AuthRegisterWorkerDto): Promise<any> {
    const checkConfirmMail = await this.validateOrganizationMail.execute(
      input.email,
      input.confirmString,
    );
    if (!checkConfirmMail) {
      throw new Error('confirmMail error');
    }
    const checkEmail = await this.userRepository.findOneByEmail(input.email);
    if (checkEmail) {
      throw new Error('email exists');
    }
    if (input.password != input.checkPassword) {
      throw new Error("passwords don't match");
    }

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
      status: StatusUser.ACTIVE,
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.createWorker(
      userData,
      checkConfirmMail,
    );
    const accessToken = await this.singAccessToken.execute(user.email, user.id);
    const refreshToken = await this.singRefreshToken.execute(
      user.email,
      user.id,
    );
    const correctUser = await this.setRefreshToken.execute(
      user.id,
      refreshToken.token,
    );
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
