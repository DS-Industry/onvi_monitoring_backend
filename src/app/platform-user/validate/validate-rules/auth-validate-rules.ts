import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class AuthValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async passwordConfirmValidate(email: string) {
    const response = await this.validateLib.userByEmailExists(email);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async registerValidate(email: string) {
    const response = await this.validateLib.userByEmailNotExists(email);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async registerWorkerValidate(email: string, confirmString: string) {
    const response = [];
    response.push(await this.validateLib.userByEmailNotExists(email));
    response.push(
      await this.validateLib.workerConfirmMailExists(email, confirmString),
    );

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }
}
