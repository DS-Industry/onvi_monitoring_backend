import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { USER_UPDATE_ROLE_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class UserPermissionValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async updateConnectedUserPosValidate(posIds: number[], ability: any) {
    const response: ValidateResponse[] = [];
    response.push(
      await this.validateLib.posIdAndPermissionsPosIdComparison(
        posIds,
        ability,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );
  }

  public async updateRoleValidate(userId: number, roleId: number) {
    const response = [];
    response.push(await this.validateLib.userByIdCheckOwner(userId));
    response.push(await this.validateLib.roleByIdExists(roleId));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );
  }
}
