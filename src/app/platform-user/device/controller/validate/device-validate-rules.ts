import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from "@pos/pos/use-cases/pos-find-methods";

@Injectable()
export class DeviceValidateRules {
  constructor(
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase
  ) {}

  public async createValidate(id: number) {
    const response = await this.checkIdPos(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
  public async createTypeValidate(name: string, code: string) {
    const response = [];
    response.push(await this.checkNameType(name));
    response.push(await this.checkCodeType(code));

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }

  public async updateTypeValidate(id: number) {
    const response = await this.checkIdType(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  private async checkIdType(id: number): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return 472;
    }
    return 200;
  }
  private async checkNameType(name: string): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByNameWithNull(name);
    if (deviceType) {
      return 470;
    }
    return 200;
  }

  private async checkCodeType(code: string): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByCodeWithNull(code);
    if (deviceType) {
      return 471;
    }
    return 200;
  }

  private async checkIdPos(id: number): Promise<number> {
    const pos = await this.findMethodsPosUseCase.getById(id);
    if (!pos) {
      return 464;
    }
    return 200;
  }
}
