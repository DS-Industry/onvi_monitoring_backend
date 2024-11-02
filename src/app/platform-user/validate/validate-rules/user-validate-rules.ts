import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class UserValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async resetPasswordValidate(password: string, oldPassword: string) {
    const response = await this.validateLib.passwordComparison(
      password,
      oldPassword,
    );

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
  }

  public async getContact(id: number) {
    const response = await this.validateLib.userByIdExists(id);
    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
    return response.object;
  }
}
