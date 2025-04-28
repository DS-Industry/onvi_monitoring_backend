import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import {
  FindMethodsCarWashDeviceTypeUseCase
} from "@pos/device/deviceType/use-cases/car-wash-device-type-find-methods";

@Injectable()
export class DeviceValidateRules {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
  ) {}

  public async createValidate(typeId: number, posId: number, name: string) {
    const response = [];
    response.push(await this.checkIdType(typeId));
    response.push(await this.checkNameAndCWId(posId, name));

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }
  public async getByIdValidate(id: number) {
    const response = await this.checkId(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }
  private async checkId(id: number): Promise<number> {
    const device = await this.findMethodsCarWashDeviceUseCase.getById(id);
    if (!device) {
      return 480;
    }
    return 200;
  }

  private async checkNameAndCWId(posId: number, name: string): Promise<number> {
    const device = await this.findMethodsCarWashDeviceUseCase.getByNameAndCWId(
      posId,
      name,
    );
    if (device) {
      return 481;
    }
    return 200;
  }

  private async checkIdType(id: number): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return 472;
    }
    return 200;
  }
}
