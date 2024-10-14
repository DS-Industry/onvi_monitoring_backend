import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { ValidateLib } from '@platform-user/validate/validate.lib';

@Injectable()
export class DeviceValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(id: number) {
    const response = await this.validateLib.posByIdExists(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
  public async createTypeValidate(name: string, code: string) {
    const response = [];
    response.push(await this.validateLib.deviceTypeByNameNotExists(name));
    response.push(await this.validateLib.deviceTypeByCodeNotExists(code));

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }

  public async updateTypeValidate(id: number) {
    const response = await this.validateLib.deviceTypeByIdExists(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async getByIdValidate(id: number) {
    const response = await this.validateLib.deviceByIdExists(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
}
