import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';
import { UserException } from '@exception/option.exceptions';
import {
  USER_GET_CONTACT_EXCEPTION_CODE,
  USER_RESET_PASSWORD_EXCEPTION_CODE,
} from '@constant/error.constants';

@Injectable()
export class UserValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async resetPasswordValidate(password: string, oldPassword: string) {
    const response = await this.validateLib.passwordComparison(
      password,
      oldPassword,
    );

    if (response.code !== 200) {
      throw new UserException(
        USER_RESET_PASSWORD_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
  }

  public async getContact(id: number) {
    const response = await this.validateLib.userByIdExists(id);
    if (response.code !== 200) {
      throw new UserException(
        USER_GET_CONTACT_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
    return response.object;
  }
}
