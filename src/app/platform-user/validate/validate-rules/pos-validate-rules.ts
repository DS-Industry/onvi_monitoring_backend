import { Injectable } from '@nestjs/common';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class PosValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(name: string, organizationId: number) {
    const response = [];
    response.push(await this.validateLib.posByNameNotExists(name));
    response.push(
      await this.validateLib.organizationByIdExists(organizationId),
    );

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }

  public async getOneByIdValidate(id: number) {
    const response = await this.validateLib.posByIdExists(id);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
}
