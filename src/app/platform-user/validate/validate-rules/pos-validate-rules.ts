import { Injectable } from '@nestjs/common';
import {
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';

@Injectable()
export class PosValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(
    name: string,
    organizationId: number,
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    response.push(await this.validateLib.posByNameNotExists(name));
    response.push(
      await this.validateLib.organizationByIdExists(organizationId),
    );

    this.validateLib.handlerArrayResponse(response);
    const organization = response.find(
      (item) => item.object !== undefined,
    )?.object;
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organization,
    );
  }

  public async getOneByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.posByIdExists(id);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      response.object,
    );
    return response.object;
  }
}
