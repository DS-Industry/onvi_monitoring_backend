import { Injectable } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-user/confirmMail/interfaces/confirmMail';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class PasswordResetUserUseCase {
  constructor(
    private readonly confirmRepository: IConfirmMailRepository,
    private readonly userUpdate: UpdateUserUseCase,
  ) {}

  async execute(user: User, password: string): Promise<any> {
    const correctUser = await this.userUpdate.execute({
      id: user.id,
      password: password,
    });

    await this.confirmRepository.removeOne(correctUser.email);

    return { status: 'password change', correctUser };
  }
}
