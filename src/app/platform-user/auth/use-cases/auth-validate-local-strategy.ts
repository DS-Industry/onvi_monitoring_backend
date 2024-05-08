import { Injectable } from '@nestjs/common';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { User } from '@platform-user/user/domain/user';

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
    const checkPassword = await this.bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new Error('password error');
    }

    return user;
  }
}
