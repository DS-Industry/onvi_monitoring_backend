import { Injectable } from '@nestjs/common';
import { ValidateConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-validate';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { User } from '@platform-user/user/domain/user';
import { UserException } from '@exception/option.exceptions';
import { USER_AUTHORIZATION_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class ValidateUserEmailStrategyUseCase {
  constructor(
    private readonly validateConfirmUseCase: ValidateConfirmMailUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string, confirmString: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const checkConfirmMail = await this.validateConfirmUseCase.execute(
      email,
      confirmString,
    );
    if (!checkConfirmMail) {
      throw new UserException(
        USER_AUTHORIZATION_EXCEPTION_CODE,
        'Unauthorized',
      );
    }

    return user;
  }
}
