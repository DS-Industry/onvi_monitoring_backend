import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class UserPermissionValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async updateRoleValidate(userId: number, roleId: number) {
    const response = [];
    response.push(await this.validateLib.userByIdExists(userId));
    response.push(await this.validateLib.userByIdCheckOwner(userId));
    response.push(await this.validateLib.roleByIdExists(roleId));

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }
}
