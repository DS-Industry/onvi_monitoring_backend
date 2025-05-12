import { Injectable } from '@nestjs/common';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { User } from '@platform-user/user/domain/user';
import { StatusUser } from "@prisma/client";
import { UserException } from "@exception/option.exceptions";
import { USER_AUTHORIZATION_EXCEPTION_CODE, USER_PASSWORD_CONFIRM_EXCEPTION_CODE } from "@constant/error.constants";

@Injectable()
export class ValidateUserForLocalStrategyUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      return null;
    }
    if (user.status !== StatusUser.ACTIVE) {
      throw new UserException(
        USER_AUTHORIZATION_EXCEPTION_CODE,
        'Unauthorized',
      );
    }
    const checkPassword = await this.bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new UserException(
        USER_PASSWORD_CONFIRM_EXCEPTION_CODE,
        'Password error',
      );
    }

    return user;
  }
}
