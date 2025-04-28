import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import {
  USER_PASSWORD_CONFIRM_EXCEPTION_CODE,
  USER_REGISTER_EXCEPTION_CODE,
  USER_REGISTER_WORKER_EXCEPTION_CODE,
} from '@constant/error.constants';
import { UserException } from '@exception/option.exceptions';
import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';

@Injectable()
export class AuthValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async passwordConfirmValidate(email: string) {
    const response = await this.validateLib.userByEmailExists(email);

    if (response.code !== 200) {
      throw new UserException(
        USER_PASSWORD_CONFIRM_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
  }

  public async registerValidate(email: string) {
    const response = await this.validateLib.userByEmailNotExists(email);

    if (response.code !== 200) {
      throw new UserException(
        USER_REGISTER_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
  }

  public async registerWorkerValidate(confirmString: string) {
    const response = [];
    response.push(
      await this.validateLib.workerConfirmMailExists(confirmString),
    );

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_REGISTER_WORKER_EXCEPTION_CODE,
    );
    return response.find((item) => item.object !== undefined)?.object;
  }

  public async registerWorker(
    confirmString: string,
  ): Promise<OrganizationConfirmMail> {
    const response = [];
    const confirmMailCheck =
      await this.validateLib.workerConfirmMailExists(confirmString);
    response.push(confirmMailCheck);
    if (confirmMailCheck.object) {
      await this.validateLib.userByEmailNotExists(
        confirmMailCheck.object.email,
      );
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_REGISTER_WORKER_EXCEPTION_CODE,
    );
    return confirmMailCheck.object;
  }
}
