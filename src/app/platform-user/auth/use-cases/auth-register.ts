import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from '@platform-user/auth/controller/dto/auth-register.dto';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly singRefreshToken: SignRefreshTokenUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  async execute(input: AuthRegisterDto): Promise<any> {
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
      userRoleId: 0,
      phone: input.phone,
      email: input.email,
      password: hashPassword,
      gender: input.gender,
      status: 'BLOCKED',
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.create(userData);

    const accessToken = await this.singAccessToken.execute(user.email, user.id);
    const refreshToken = await this.singRefreshToken.execute(
      user.email,
      user.id,
    );

    user.refreshTokenId = refreshToken.token;

    const correctUser = await this.updateUser.execute(user);

    return { correctUser, accessToken, refreshToken };
  }
}
