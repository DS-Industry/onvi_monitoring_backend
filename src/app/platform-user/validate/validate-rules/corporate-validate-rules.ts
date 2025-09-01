import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { CORPORATE_GET_BY_ID_EXCEPTION_CODE } from '@constant/error.constants';
import { LoyaltyException } from '@exception/option.exceptions';

@Injectable()
export class CorporateValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async getByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.corporateByIdExists(id);

    if (response.code !== 200) {
      throw new LoyaltyException(
        CORPORATE_GET_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    // Check if user has access to the organization that owns this corporate
    const corporate = response.object;
    if (corporate.organization) {
      ForbiddenError.from(ability).throwUnlessCan(
        PermissionAction.read,
        corporate.organization,
      );
    }

    return response.object;
  }
}
