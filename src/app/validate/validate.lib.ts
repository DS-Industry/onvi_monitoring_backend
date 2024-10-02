import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class ValidateLib {
  constructor(
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  public async deviceTypeByIdAvailability(id: number): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return 472;
    }
    return 200;
  }
}
