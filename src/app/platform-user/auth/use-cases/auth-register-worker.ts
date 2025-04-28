import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { StatusUser } from '@prisma/client';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { AuthRegisterWorkerDto } from '@platform-user/auth/use-cases/dto/auth-register-worker.dto';
import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';
import { UpdateConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-update';

@Injectable()
export class AuthRegisterWorkerUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly bcrypt: IBcryptAdapter,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly updateConfirmMailUseCase: UpdateConfirmMailUseCase,
  ) {}

  async execute(
    input: AuthRegisterWorkerDto,
    organizationConfirmMail: OrganizationConfirmMail,
  ): Promise<any> {
    const hashPassword = await this.bcrypt.hash(input.password);
    const userData = new User({
      name: organizationConfirmMail.name,
      surname: organizationConfirmMail?.surname,
      middlename: organizationConfirmMail?.middlename,
      birthday: organizationConfirmMail.birthday,
      userRoleId: organizationConfirmMail.roleId,
      phone: organizationConfirmMail.phone,
      email: organizationConfirmMail.email,
      password: hashPassword,
      position: organizationConfirmMail.position,
      status: StatusUser.ACTIVE,
      receiveNotifications: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.createWorker(
      userData,
      organizationConfirmMail.organizationId,
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

    await this.updateConfirmMailUseCase.execute(organizationConfirmMail);
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
