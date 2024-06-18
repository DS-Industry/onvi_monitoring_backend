import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';

@Injectable()
export class PasswordConfirmMailUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(email: string): Promise<any> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new Error('the account was not found');
    }

    return await this.sendConfirm.execute(user.email, 'Смена пароля');
  }
}
