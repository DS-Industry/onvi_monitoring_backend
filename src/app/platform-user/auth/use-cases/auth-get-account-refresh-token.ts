import { Injectable } from '@nestjs/common';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { User } from '@prisma/client';

@Injectable()
export class GetUserIfRefreshTokenMatchesUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(refreshToken: string, email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new Error('email not exists');
    }

    const isRefreshingTokenMatching = await this.bcrypt.compare(
      refreshToken,
      user.refreshTokenId,
    );

    if (isRefreshingTokenMatching) {
      return user;
    }
  }
}
