import { Injectable } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-user/confirmMail/interfaces/confirmMail';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class PasswordResetUserUseCase {
  constructor(
    private readonly confirmRepository: IConfirmMailRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly userUpdate: UpdateUserUseCase,
  ) {}

  async execute(
    user: User,
    password: string,
    chPassword: string,
  ): Promise<any> {
    if (password != chPassword) {
      throw new Error("passwords don't match");
    }

    const hashPassword = await this.bcrypt.hash(password);

    const correctUser = await this.userUpdate.execute({
      id: user.id,
      password: hashPassword,
    });

    await this.confirmRepository.removeOne(correctUser.email);

    return { status: 'password change', correctUser };
  }
}
