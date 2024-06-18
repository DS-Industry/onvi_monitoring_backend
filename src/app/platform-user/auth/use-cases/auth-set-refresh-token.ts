import { Injectable } from '@nestjs/common';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { User } from '@platform-user/user/domain/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';

@Injectable()
export class SetRefreshTokenUseCase {
  constructor(
    private readonly userUpdate: UpdateUserUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(id: number, token: string): Promise<User> {
    const hashedRefreshToken = await this.bcrypt.hash(token);
    return await this.userUpdate.execute({
      id: id,
      refreshTokenId: hashedRefreshToken,
    });
  }
}
