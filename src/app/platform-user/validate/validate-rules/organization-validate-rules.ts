import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';

@Injectable()
export class OrganizationValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async addWorkerValidate(
    email: string,
    organizationId: number,
    userId: number,
  ) {
    const response = [];
    response.push(await this.validateLib.userByEmailNotExists(email));
    response.push(
      await this.validateLib.organizationByOwnerExists(organizationId, userId),
    );
    this.validateLib.handlerArrayResponse(response);
  }

  public async verificateValidate(organizationId: number) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
    return response.object;
  }

  public async updateValidate(organizationId: number, ability: any) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      response.object,
    );
    return response.object;
  }

  public async getOneByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.organizationByIdExists(id);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      response.object,
    );
    return response.object;
  }

  public async createValidate(name: string) {
    const response = await this.validateLib.organizationByNameNotExists(name);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
  }
}
