import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

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

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }

  public async verificateValidate(organizationId: number) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async updateValidate(organizationId: number) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async getOneByIdValidate(id: number) {
    const response = await this.validateLib.organizationByIdExists(id);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async createValidate(name: string) {
    const response = await this.validateLib.organizationByNameNotExists(name);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
}
