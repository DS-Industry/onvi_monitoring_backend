import { Injectable } from '@nestjs/common';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { ValidateLib } from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';

@Injectable()
export class DeviceValidateRules {
  constructor(
    private readonly validateLib: ValidateLib,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  public async createValidate(id: number) {
    const response = await this.validateLib.posByIdExists(id);
    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
  }
  public async createTypeValidate(name: string, code: string) {
    const response = [];
    response.push(await this.validateLib.deviceTypeByNameNotExists(name));
    response.push(await this.validateLib.deviceTypeByCodeNotExists(code));

    this.validateLib.handlerArrayResponse(response);
  }

  public async updateTypeValidate(id: number) {
    const response = await this.validateLib.deviceTypeByIdExists(id);
    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }
    return response.object;
  }

  public async getByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.deviceByIdExists(id);
    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }

    const device = response.object;
    const pos = await this.findMethodsPosUseCase.getById(device.carWashPosId);
    ForbiddenError.from(ability).throwUnlessCan(PermissionAction.read, pos);
  }
}
