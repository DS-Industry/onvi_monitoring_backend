import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class AuthValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async passwordConfirmValidate(email: string) {
    const response = await this.validateLib.userByEmailExists(email);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
  }

  public async registerValidate(email: string) {
    const response = await this.validateLib.userByEmailNotExists(email);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
  }

  public async registerWorkerValidate(email: string, confirmString: string) {
    const response = [];
    response.push(await this.validateLib.userByEmailNotExists(email));
    response.push(
      await this.validateLib.workerConfirmMailExists(email, confirmString),
    );

    this.validateLib.handlerArrayResponse(response);
    return response.find((item) => item.object !== undefined)?.object;
  }
}
